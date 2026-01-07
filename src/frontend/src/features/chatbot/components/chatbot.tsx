"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { chatbotService } from "../services/chatbot.service";
import { ChatWindow } from "./chat-window";
import { FloatingButton } from "./floating-button";
import { VtonChatbot } from "./vton-chatbot";
import { cn } from "@/lib/utils";
import { useProductContext } from "../hooks/use-product-context";
import type {
  ChatMessage,
  ChatbotTaskType,
  SuggestedQuestion,
} from "../types/chatbot.type";

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: "1", text: "Tìm sản phẩm mới", icon: "🔍" },
  { id: "2", text: "Tư vấn phối đồ", icon: "👔" },
  { id: "3", text: "Thử đồ ảo AI", icon: "🎨" },
];

function inferTaskTypeFromSuggestion(question: string): ChatbotTaskType | null {
  const q = question.toLowerCase();
  if (q.includes("thử đồ") || q.includes("try-on") || q.includes("vton")) return "TASK_VTON";
  if (q.includes("tìm") || q.includes("sản phẩm") || q.includes("phối đồ")) return "TASK_FIND";
  if (q.includes("gợi ý") || q.includes("bạn làm được gì")) return "TASK_SUGGESTION";
  return null;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [taskType, setTaskType] = useState<ChatbotTaskType | null>(null);
  const [mode, setMode] = useState<"chat" | "vton">("chat");
  
  // Đọc URL để kiểm tra xem user có đang ở product page không
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentProduct = useProductContext();
  
  // Kiểm tra xem có đang ở product detail page không
  const isOnProductPage = useMemo(() => {
    return pathname?.includes("/products/") && currentProduct !== null;
  }, [pathname, currentProduct]);

  const toggleChat = () => {
    onToggle(!isOpen);
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) return;
    
    // Validate character count limit (100 characters)
    if (trimmedInput.length > 100) {
      console.warn("Input exceeds 100 characters limit, cannot send");
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    startTransition(async () => {
      try {
        const response = await chatbotService.getRecommendation(trimmedInput, taskType);

        // Debug: Log response trong component
        console.log("=== Chatbot Component Response ===");
        console.log("Task Type:", response.taskType);
        console.log("UI Type:", response.ui);
        console.log("Message:", response.message);
        console.log("Recommendations:", response.recommendations);
        console.log("Recommendations type:", typeof response.recommendations);
        console.log("Recommendations is array:", Array.isArray(response.recommendations));
        if (response.recommendations) {
          console.log("Recommendations length:", response.recommendations.length);
          console.log("First recommendation:", response.recommendations[0]);
        }
        console.log("Full Response:", response);
        console.log("===================================");

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: response.message || "",
          timestamp: new Date(),
          response,
          data: response.recommendations, // legacy path for existing UI
        };

        // Debug: Log message được tạo
        console.log("=== AI Message Created ===");
        console.log("Message data:", aiMessage.data);
        console.log("Message response.recommendations:", aiMessage.response?.recommendations);
        console.log("Message response.filterOptions:", aiMessage.response?.filterOptions);
        console.log("===========================");

        setMessages((prev) => [...prev, aiMessage]);

        // Handle TASK_FIND: Redirect to /products with filters
        if (response.taskType === "TASK_FIND" && response.filterOptions) {
          console.log("=== TASK_FIND: Redirecting to /products ===");
          console.log("Filter options:", response.filterOptions);
          
          // Build query params from filterOptions
          const params = new URLSearchParams();
          Object.entries(response.filterOptions).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              // Map sortOption: "relevance" -> "time" (product service only supports "price" | "time")
              if (key === "sortOption" && value === "relevance") {
                params.set(key, "time");
              } else {
                params.set(key, String(value));
              }
            }
          });
          
          const queryString = params.toString();
          const redirectUrl = queryString ? `/products?${queryString}` : "/products";
          
          console.log("Redirecting to:", redirectUrl);
          console.log("==========================================");
          
          // Close chatbot and redirect
          onToggle(false);
          router.push(redirectUrl);
          return; // Exit early, don't process further
        }

        // Switch UI mode based on backend response
        if (response.ui === "VTON") {
          // Nếu user đang ở product page và yêu cầu thử đồ, tự động chuyển sang VTON mode
          // VtonChatbot sẽ tự động load product từ URL context
          console.log("=== Switching to VTON mode ===");
          console.log("Is on product page:", isOnProductPage);
          console.log("Current product:", currentProduct);
          if (isOnProductPage && currentProduct) {
            console.log("Product will be loaded from URL context:", currentProduct.optionId);
          }
          console.log("==============================");
          setMode("vton");
          // Reset taskType khi chuyển sang VTON mode (VTON là một mode riêng, không phải task type cho conversation)
          setTaskType(null);
        } else {
          // Reset to chat mode for other UI types (TEXT, PRODUCTS, SUGGESTIONS)
          setMode("chat");
          // Chỉ persist taskType cho các task khác (không phải VTON)
          // Nhưng chỉ persist nếu taskType không phải TASK_OTHER (để tránh persist các câu hỏi chung chung)
          if (response.taskType && response.taskType !== "TASK_OTHER") {
            setTaskType(response.taskType);
          } else {
            // Reset taskType cho TASK_OTHER để mỗi request được classify lại
            setTaskType(null);
          }
        }
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: `ai-error-${Date.now()}`,
          role: "ai",
          content:
            error instanceof Error
              ? error.message
              : "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    });
  };

  const handleSelectQuestion = (question: string) => {
    setInput(question);
    const inferred = inferTaskTypeFromSuggestion(question);
    if (inferred) setTaskType(inferred);
    // Auto send after a short delay for better UX
    setTimeout(() => {
      const trimmedInput = question.trim();
      if (!trimmedInput) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmedInput,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      startTransition(async () => {
        try {
          const response = await chatbotService.getRecommendation(
            trimmedInput,
            inferred ?? taskType
          );

          // Debug: Log response trong component
          console.log("=== Chatbot Component Response (Select Question) ===");
          console.log("Task Type:", response.taskType);
          console.log("UI Type:", response.ui);
          console.log("Message:", response.message);
          console.log("Recommendations:", response.recommendations);
          console.log("Recommendations type:", typeof response.recommendations);
          console.log("Recommendations is array:", Array.isArray(response.recommendations));
          if (response.recommendations) {
            console.log("Recommendations length:", response.recommendations.length);
            console.log("First recommendation:", response.recommendations[0]);
          }
          console.log("Full Response:", response);
          console.log("=====================================================");

          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: response.message || "",
            timestamp: new Date(),
            response,
            data: response.recommendations,
          };

          // Debug: Log message được tạo
          console.log("=== AI Message Created (Select Question) ===");
          console.log("Message data:", aiMessage.data);
          console.log("Message response.recommendations:", aiMessage.response?.recommendations);
          console.log("Message response.filterOptions:", aiMessage.response?.filterOptions);
          console.log("==============================================");

          setMessages((prev) => [...prev, aiMessage]);

          // Handle TASK_FIND: Redirect to /products with filters
          if (response.taskType === "TASK_FIND" && response.filterOptions) {
            console.log("=== TASK_FIND: Redirecting to /products (Select Question) ===");
            console.log("Filter options:", response.filterOptions);
            
            // Build query params from filterOptions
            const params = new URLSearchParams();
            Object.entries(response.filterOptions).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== "") {
                // Map sortOption: "relevance" -> "time" (product service only supports "price" | "time")
                if (key === "sortOption" && value === "relevance") {
                  params.set(key, "time");
                } else {
                  params.set(key, String(value));
                }
              }
            });
            
            const queryString = params.toString();
            const redirectUrl = queryString ? `/products?${queryString}` : "/products";
            
            console.log("Redirecting to:", redirectUrl);
            console.log("=============================================================");
            
            // Close chatbot and redirect
            onToggle(false);
            router.push(redirectUrl);
            return; // Exit early, don't process further
          }

          // Switch UI mode based on backend response
          if (response.ui === "VTON") {
            // Nếu user đang ở product page và yêu cầu thử đồ, tự động chuyển sang VTON mode
            // VtonChatbot sẽ tự động load product từ URL context
            console.log("=== Switching to VTON mode (Select Question) ===");
            console.log("Is on product page:", isOnProductPage);
            console.log("Current product:", currentProduct);
            if (isOnProductPage && currentProduct) {
              console.log("Product will be loaded from URL context:", currentProduct.optionId);
            }
            console.log("================================================");
            setMode("vton");
            // Reset taskType khi chuyển sang VTON mode
            setTaskType(null);
          } else {
            // Reset to chat mode for other UI types (TEXT, PRODUCTS, SUGGESTIONS)
            setMode("chat");
            // Chỉ persist taskType cho các task khác (không phải VTON)
            if (response.taskType && response.taskType !== "TASK_OTHER") {
              setTaskType(response.taskType);
            } else {
              // Reset taskType cho TASK_OTHER
              setTaskType(null);
            }
          }
        } catch (error) {
          const errorMessage: ChatMessage = {
            id: `ai-error-${Date.now()}`,
            role: "ai",
            content:
              error instanceof Error
                ? error.message
                : "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, errorMessage]);
        }
      });
    }, 100);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={toggleChat}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed right-0 top-0 h-screen w-full md:w-[500px] bg-card border-l border-border shadow-lg transition-transform duration-300 z-60 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-full"
        )}
      >
        {mode === "vton" ? (
          <VtonChatbot
            onBack={() => {
              setMode("chat");
              // Reset taskType khi quay lại chat mode từ VTON
              setTaskType(null);
            }}
            onClose={toggleChat}
          />
        ) : (
          <ChatWindow
            messages={messages}
            input={input}
            isLoading={isPending}
            suggestedQuestions={SUGGESTED_QUESTIONS}
            onInputChange={setInput}
            onSend={handleSend}
            onClose={toggleChat}
            onSelectQuestion={handleSelectQuestion}
          />
        )}
      </aside>
      <FloatingButton isOpen={isOpen} onClick={toggleChat} />
    </>
  );
}
