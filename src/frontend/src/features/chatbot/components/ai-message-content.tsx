"use client";

import Link from "next/link";
import type { ChatbotRecommendResponse } from "../types/chatbot.type";

interface AiMessageContentProps {
  response: ChatbotRecommendResponse;
}

export function AiMessageContent({ response }: AiMessageContentProps) {
  if (!response || response.length === 0) {
    return (
      <p className="text-sm text-foreground">
        Xin lỗi, tôi chưa tìm thấy sản phẩm phù hợp.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {response.map((group, idx) => (
        <div key={idx} className="space-y-3">
          {/* Suggestion text */}
          <p className="text-sm text-foreground italic">
            &quot;{group.suggestion}&quot;
          </p>

          {/* Products horizontal scroll */}
          {group.matchedProducts && group.matchedProducts.length > 0 && (
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              {group.matchedProducts.map((prod) => (
                <Link
                  href={prod.productUrl}
                  key={prod.id}
                  className="min-w-[150px] border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-card shrink-0"
                >
                  <div className="relative w-full h-32 bg-muted">
                    <img
                      src={prod.thumbnail || prod.imageUrl || "/no-image.png"}
                      alt={prod.name || "Sản phẩm"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/no-image.png";
                      }}
                    />
                  </div>
                  <div className="p-2 space-y-1">
                    {prod.name && (
                      <p className="text-xs font-semibold truncate text-foreground">
                        {prod.name}
                      </p>
                    )}
                    {prod.price && (
                      <p className="text-sm font-bold text-primary">
                        {prod.price.toLocaleString("vi-VN")}đ
                      </p>
                    )}
                    {prod.matchScore && (
                      <p className="text-xs text-muted-foreground">
                        Độ phù hợp: {prod.matchScore}%
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

