"use client";

import { useState } from "react";
import { X, MessageCircle, Bot, Send } from "lucide-react";

export function ChatbotFAB() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Window - appears when open */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI4STYLE Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-primary-foreground/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
            <div className="space-y-4">
              {/* Bot message */}
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
                  AI
                </div>
                <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%] border border-border">
                  <p className="text-sm text-foreground">
                    Xin chào! Tôi là trợ lý thời trang AI. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn phối đồ, hoặc trả lời các câu hỏi về thời trang. Bạn cần giúp gì?
                  </p>
                </div>
              </div>

              {/* Suggested questions */}
              <div className="flex flex-col space-y-2">
                <button className="bg-card hover:bg-muted border border-border p-3 rounded-xl text-sm text-left transition-colors text-foreground">
                  🔍 Tìm sản phẩm mới
                </button>
                <button className="bg-card hover:bg-muted border border-border p-3 rounded-xl text-sm text-left transition-colors text-foreground">
                  👔 Tư vấn phối đồ
                </button>
                <button className="bg-card hover:bg-muted border border-border p-3 rounded-xl text-sm text-left transition-colors text-foreground">
                  🎨 Thử đồ ảo AI
                </button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-input rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-background text-foreground"
              />
              <button className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
