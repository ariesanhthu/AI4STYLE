"use client";

import type { ChatMessage } from "../types/chatbot.type";
import { MessageItem } from "./message-item";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
      <div className="space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
              AI
            </div>
            <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%] border border-border">
              <p className="text-sm text-foreground">
                Xin chào! Tôi là trợ lý thời trang AI. Tôi có thể giúp bạn tìm
                kiếm sản phẩm, tư vấn phối đồ, hoặc trả lời các câu hỏi về thời
                trang. Bạn cần giúp gì?
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
              AI
            </div>
            <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm border border-border">
              <p className="text-sm text-muted-foreground">
                Stylist đang suy nghĩ...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

