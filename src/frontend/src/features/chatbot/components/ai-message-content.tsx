"use client";

import { useState, useEffect } from "react";
import type { ChatbotRecommendResponse, MatchedProduct } from "../types/chatbot.type";
import { ProductCard } from "@/features/user-product/components/product-card";
import { Product } from "@/features/user-product/types/product";
import { productDetailsService } from "@/features/user-product-details/services/product-details.service";

interface AiMessageContentProps {
  response: ChatbotRecommendResponse;
}

// Wrapper component để fetch full product và render ProductCard
function ChatbotProductCard({ matchedProduct }: { matchedProduct: MatchedProduct }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fullProduct = await productDetailsService.getProductById(matchedProduct.id);
        setProduct(fullProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [matchedProduct.id]);

  if (loading) {
    return (
      <div className="min-w-[120px] border border-border rounded-xl overflow-hidden bg-card shrink-0 animate-pulse">
        <div className="w-full h-24 bg-muted" />
        <div className="p-1.5 space-y-1.5">
          <div className="h-3 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-w-[120px] max-w-[120px] shrink-0 scale-90 origin-top-left">
      <ProductCard product={product} />
    </div>
  );
}

export function AiMessageContent({ response }: AiMessageContentProps) {
  // Debug: Log response
  console.log("=== AiMessageContent ===");
  console.log("Response:", response);
  console.log("Response type:", typeof response);
  console.log("Response is array:", Array.isArray(response));
  console.log("Response length:", Array.isArray(response) ? response.length : "not array");
  if (Array.isArray(response) && response.length > 0) {
    console.log("First item:", response[0]);
    if (response[0]?.matchedProducts) {
      console.log("First item matchedProducts:", response[0].matchedProducts);
      console.log("MatchedProducts length:", response[0].matchedProducts.length);
    }
  }
  console.log("========================");

  if (!response || response.length === 0) {
    console.log("No response or empty, showing error message");
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
                <ChatbotProductCard key={prod.id} matchedProduct={prod} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

