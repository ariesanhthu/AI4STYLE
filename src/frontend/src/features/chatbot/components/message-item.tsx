"use client";

import { Bot } from "lucide-react";
import type { ChatMessage } from "../types/chatbot.type";
import { AiMessageContent } from "./ai-message-content";

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex items-start justify-end space-x-2">
        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[70%]">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
          Bạn
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-2">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%] border border-border">
        {message.data ? (
          <AiMessageContent response={message.data} />
        ) : (
          <p className="text-sm text-foreground">{message.content}</p>
        )}
      </div>
    </div>
  );
}

