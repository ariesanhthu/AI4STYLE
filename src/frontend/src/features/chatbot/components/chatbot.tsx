"use client";

import { useState, useTransition } from "react";
import { chatbotService } from "../services/chatbot.service";
import { ChatWindow } from "./chat-window";
import { FloatingButton } from "./floating-button";
import { VtonChatbot } from "./vton-chatbot";
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

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [taskType, setTaskType] = useState<ChatbotTaskType | null>(null);
  const [mode, setMode] = useState<"chat" | "vton">("chat");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) return;

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

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: response.message || "",
          timestamp: new Date(),
          response,
          data: response.recommendations, // legacy path for existing UI
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Persist taskType so next turns skip classify
        setTaskType(response.taskType);

        // Switch UI mode based on backend response
        if (response.ui === "VTON") {
          setMode("vton");
        } else {
          // Reset to chat mode for other UI types (TEXT, PRODUCTS, SUGGESTIONS)
          setMode("chat");
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

          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: response.message || "",
            timestamp: new Date(),
            response,
            data: response.recommendations,
          };

          setMessages((prev) => [...prev, aiMessage]);

          setTaskType(response.taskType);
          // Switch UI mode based on backend response
          if (response.ui === "VTON") {
            setMode("vton");
          } else {
            // Reset to chat mode for other UI types (TEXT, PRODUCTS, SUGGESTIONS)
            setMode("chat");
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
        <>
          {mode === "vton" ? (
            <VtonChatbot
              onBack={() => setMode("chat")}
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
        </>
      )}
      <FloatingButton isOpen={isOpen} onClick={toggleChat} />
    </>
  );
}
