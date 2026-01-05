"use client";

import { useState, useTransition } from "react";
import { chatbotService } from "../services/chatbot.service";
import { ChatWindow } from "./chat-window";
import { FloatingButton } from "./floating-button";
import type { ChatMessage, SuggestedQuestion } from "../types/chatbot.type";

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: "1", text: "Tìm sản phẩm mới", icon: "🔍" },
  { id: "2", text: "Tư vấn phối đồ", icon: "👔" },
  { id: "3", text: "Thử đồ ảo AI", icon: "🎨" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

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
        const data = await chatbotService.getRecommendation(trimmedInput);

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: "",
          timestamp: new Date(),
          data,
        };

        setMessages((prev) => [...prev, aiMessage]);
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
          const data = await chatbotService.getRecommendation(trimmedInput);

          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: "",
            timestamp: new Date(),
            data,
          };

          setMessages((prev) => [...prev, aiMessage]);
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
      <FloatingButton isOpen={isOpen} onClick={toggleChat} />
    </>
  );
}
