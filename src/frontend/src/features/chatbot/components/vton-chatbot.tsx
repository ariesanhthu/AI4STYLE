"use client";

import React, { useState, useEffect, useMemo } from "react";
import { vtonService } from "../services/vton.service";
import { VtonCategory, ChatMessage } from "../types/vton.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth-management";
import { useProductContext } from "../hooks/use-product-context";
import { urlToFile, createPreviewUrl, revokePreviewUrl } from "../utils/image-utils";
import { Product } from "@/features/user-product/types/product";
import { productService } from "@/features/user-product/services/product.service";
import { productDetailsService } from "@/features/user-product-details/services/product-details.service";

export function VtonChatbot() {
  const { user } = useAuth();
  const currentProduct = useProductContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // State cho ảnh cá nhân
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [personConfirmed, setPersonConfirmed] = useState(false);

  // State cho ảnh trang phục
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [garmentConfirmed, setGarmentConfirmed] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [showProductSelection, setShowProductSelection] = useState(false);

  const [category, setCategory] = useState<VtonCategory>("Upper-body");
  const [isHD, setIsHD] = useState(false);

  // Load ảnh cá nhân từ user profile nếu có
  useEffect(() => {
    if (user?.avatar && !personFile && !personPreview) {
      setPersonPreview(user.avatar);
    }
  }, [user?.avatar, personFile, personPreview]);

  // Lấy product từ messages (nếu có product_id trong messages trước đó)
  const productFromMessages = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.productId) {
        return msg.productId;
      }
    }
    return null;
  }, [messages]);

  // Load garment từ các nguồn (chỉ load một lần khi mount hoặc khi có thay đổi)
  const [garmentLoaded, setGarmentLoaded] = useState(false);

  useEffect(() => {
    const loadGarment = async () => {
      // Chỉ load nếu chưa có garment và chưa load
      if (garmentLoaded || garmentFile || garmentPreview) {
        return;
      }

      // Nguồn 1: Từ messages (product_id gần nhất)
      if (productFromMessages) {
        try {
          const product = await productDetailsService.getProductById(productFromMessages);
          if (product?.images?.[0]) {
            const file = await urlToFile(product.images[0], `product-${product.optionId}.jpg`);
            setGarmentFile(file);
            setGarmentPreview(createPreviewUrl(file));
            setGarmentLoaded(true);
            return;
          }
        } catch (error) {
          console.error("Error loading product from messages:", error);
        }
      }

      // Nguồn 2: Từ product detail page hiện tại
      if (currentProduct?.images?.[0]) {
        try {
          const file = await urlToFile(
            currentProduct.images[0],
            `product-${currentProduct.optionId}.jpg`
          );
          setGarmentFile(file);
          setGarmentPreview(createPreviewUrl(file));
          setGarmentLoaded(true);
          return;
        } catch (error) {
          console.error("Error loading product from context:", error);
        }
      }

      // Nguồn 3: Load suggestions nếu không có nguồn nào
      if (!productFromMessages && !currentProduct) {
        loadSuggestions();
        setGarmentLoaded(true);
      }
    };

    loadGarment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFromMessages, currentProduct]);

  const loadSuggestions = async () => {
    try {
      const products = await productService.getBestSellers();
      setSuggestedProducts(products.slice(0, 6));
      setShowProductSelection(true);
    } catch (error) {
      console.error("Error loading suggestions:", error);
    }
  };

  // Handle upload ảnh cá nhân mới
  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke old preview URL
      if (personPreview && personPreview.startsWith("blob:")) {
        revokePreviewUrl(personPreview);
      }

      setPersonFile(file);
      setPersonPreview(createPreviewUrl(file));
      setPersonConfirmed(false); // Reset confirmation khi upload mới
    }
  };

  // Xác nhận ảnh cá nhân
  const confirmPersonImage = async () => {
    if (personPreview) {
      if (personFile) {
        // Đã có file từ upload
        setPersonConfirmed(true);
      } else if (personPreview.startsWith("http")) {
        // Cần convert từ URL
        try {
          const file = await urlToFile(personPreview, "person-avatar.jpg");
          setPersonFile(file);
          setPersonConfirmed(true);
        } catch (error) {
          console.error("Error converting person image:", error);
          alert("Không thể tải ảnh cá nhân. Vui lòng thử lại.");
        }
      }
    }
  };

  // Handle chọn garment từ suggestions
  const handleSelectGarment = async (product: Product) => {
    if (product.images?.[0]) {
      try {
        // Revoke old preview URL
        if (garmentPreview && garmentPreview.startsWith("blob:")) {
          revokePreviewUrl(garmentPreview);
        }

        const file = await urlToFile(product.images[0], `product-${product.optionId}.jpg`);
        setGarmentFile(file);
        setGarmentPreview(createPreviewUrl(file));
        setShowProductSelection(false);
        setGarmentConfirmed(false); // Reset confirmation
        setGarmentLoaded(true); // Mark as loaded
      } catch (error) {
        console.error("Error loading selected product:", error);
        alert("Không thể tải ảnh sản phẩm. Vui lòng thử lại.");
      }
    }
  };

  // Handle upload ảnh trang phục mới
  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke old preview URL
      if (garmentPreview && garmentPreview.startsWith("blob:")) {
        revokePreviewUrl(garmentPreview);
      }

      setGarmentFile(file);
      setGarmentPreview(createPreviewUrl(file));
      setShowProductSelection(false);
      setGarmentConfirmed(false); // Reset confirmation
      setGarmentLoaded(true); // Mark as loaded to prevent auto-load
    }
  };

  // Xác nhận ảnh trang phục
  const confirmGarmentImage = async () => {
    if (garmentPreview) {
      if (garmentFile) {
        // Đã có file
        setGarmentConfirmed(true);
      } else if (garmentPreview.startsWith("http")) {
        // Cần convert từ URL
        try {
          const file = await urlToFile(garmentPreview, "garment.jpg");
          setGarmentFile(file);
          setGarmentConfirmed(true);
        } catch (error) {
          console.error("Error converting garment image:", error);
          alert("Không thể tải ảnh trang phục. Vui lòng thử lại.");
        }
      }
    }
  };

  const handleTryOn = async () => {
    if (!personFile || !garmentFile) {
      alert("Vui lòng xác nhận đủ ảnh người và ảnh áo!");
      return;
    }

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "Đang tạo hình ảnh thử đồ...", type: "text" },
    ]);

    try {
      const resultUrl = await vtonService.generateTryOn({
        personImg: personFile,
        garmentImg: garmentFile,
        category,
        isHD,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: resultUrl, type: "image" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Có lỗi xảy ra khi xử lý ảnh.",
          type: "text",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (personPreview && personPreview.startsWith("blob:")) {
        revokePreviewUrl(personPreview);
      }
      if (garmentPreview && garmentPreview.startsWith("blob:")) {
        revokePreviewUrl(garmentPreview);
      }
    };
  }, [personPreview, garmentPreview]);

  return (
    <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-xl border bg-card shadow-xl">
      {/* Header */}
      <div className="bg-primary p-4 text-center font-bold text-primary-foreground">
        AI Virtual Try-On Assistant
      </div>

      {/* Message Area */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-muted/30 p-4">
        {messages.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
            <p>
              Chào mừng đến với AI Virtual Try-On!
              <br />
              Vui lòng chọn ảnh người mẫu và quần áo để bắt đầu.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "border bg-card"
              )}
            >
              {msg.type === "image" ? (
                <img
                  src={msg.content}
                  alt="Try-on result"
                  className="w-full rounded-md"
                />
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="animate-pulse text-xs text-muted-foreground">
            AI đang thiết kế trang phục...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-2 border-t bg-card p-4">
        {/* Ảnh cá nhân */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Ảnh cá nhân
          </label>
          {personPreview ? (
            <div className="space-y-2">
              <div className="relative">
                <img
                  src={personPreview}
                  alt="Person preview"
                  className="h-24 w-full rounded-md object-cover border"
                />
                {personConfirmed && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Đã xác nhận
                  </div>
                )}
              </div>
              {!personConfirmed && (
                <Button
                  onClick={confirmPersonImage}
                  size="sm"
                  className="w-full"
                >
                  Xác nhận ảnh này
                </Button>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handlePersonUpload}
                className="text-xs"
              />
            </div>
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={handlePersonUpload}
              className="text-xs"
            />
          )}
        </div>

        {/* Ảnh trang phục */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase text-muted-foreground">
            Ảnh trang phục
          </label>
          {showProductSelection && suggestedProducts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Chọn một sản phẩm:
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {suggestedProducts.map((product) => (
                  <button
                    key={product.optionId}
                    onClick={() => handleSelectGarment(product)}
                    className="relative aspect-square rounded-md overflow-hidden border hover:border-primary transition"
                  >
                    <img
                      src={product.thumbnail || "/no-image.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <Button
                onClick={loadSuggestions}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Xem thêm
              </Button>
            </div>
          ) : garmentPreview ? (
            <div className="space-y-2">
              <div className="relative">
                <img
                  src={garmentPreview}
                  alt="Garment preview"
                  className="h-24 w-full rounded-md object-cover border"
                />
                {garmentConfirmed && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ Đã xác nhận
                  </div>
                )}
              </div>
              {!garmentConfirmed && (
                <Button
                  onClick={confirmGarmentImage}
                  size="sm"
                  className="w-full"
                >
                  Xác nhận ảnh này
                </Button>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleGarmentUpload}
                className="text-xs"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleGarmentUpload}
                className="text-xs"
              />
              <Button
                onClick={loadSuggestions}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Chọn từ sản phẩm gợi ý
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as VtonCategory)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            disabled={isHD}
          >
            <option value="Upper-body">Áo</option>
            <option value="Lower-body">Quần</option>
            <option value="Dress">Váy</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isHD}
              onChange={(e) => setIsHD(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs">HD</span>
          </label>
        </div>

        <Button
          onClick={handleTryOn}
          disabled={loading || !personConfirmed || !garmentConfirmed}
          className="w-full"
        >
          {loading ? "Đang xử lý..." : "Bắt đầu Thử đồ"}
        </Button>
      </div>
    </div>
  );
}
