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
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-from to-brand-to text-white p-4 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI4STYLE Assistant</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {/* Bot message */}
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-from to-brand-to rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  AI
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[70%]">
                  <p className="text-sm text-gray-800">
                    Xin chào! Tôi là trợ lý thời trang AI. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn phối đồ, hoặc trả lời các câu hỏi về thời trang. Bạn cần giúp gì?
                  </p>
                </div>
              </div>

              {/* Suggested questions */}
              <div className="flex flex-col space-y-2">
                <button className="bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-left transition-colors">
                  🔍 Tìm sản phẩm mới
                </button>
                <button className="bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-left transition-colors">
                  👔 Tư vấn phối đồ
                </button>
                <button className="bg-white hover:bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm text-left transition-colors">
                  🎨 Thử đồ ảo AI
                </button>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-to text-sm"
              />
              <button className="bg-gradient-to-r from-brand-from to-brand-to text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-brand-from to-brand-to text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
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
