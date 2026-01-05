"use client";

import { Bot, X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold">AI4STYLE Assistant</h3>
          <p className="text-xs text-primary-foreground/80">
            Luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
        aria-label="Đóng chatbot"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

