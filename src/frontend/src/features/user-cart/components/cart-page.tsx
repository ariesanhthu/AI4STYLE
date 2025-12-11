"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";

const MAX_PRODUCT = 10;

export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalItems, clearCart } =
    useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.newPrice;
    return acc + price * item.quantity;
  }, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gray-100 p-6">
            <span className="text-4xl">🛒</span>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="mb-8 text-gray-500">
          Hãy khám phá thêm các sản phẩm tuyệt vời của chúng tôi.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  const handleCheckoutSuccess = () => {
    clearCart();
    // Redirect or show success message driven by form result
    alert("Đặt hàng thành công! Cảm ơn bạn.");
    setIsCheckingOut(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {isCheckingOut ? "Thanh toán" : "Giỏ hàng"}
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Cart Items OR Checkout Form */}
        <div className="lg:col-span-2">
          {isCheckingOut ? (
            <CheckoutForm
              cartItems={cartItems}
              onCancel={() => setIsCheckingOut(false)}
              onSubmit={handleCheckoutSuccess}
            />
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const { product, quantity, selectedVariantId } = item;
                const variant = product.variants.find(
                  (v) => v.variantId === selectedVariantId
                );
                const displayPrice = variant
                  ? variant.newPrice
                  : product.newPrice;
                const displaySubtotal = displayPrice * quantity;

                return (
                  <div
                    key={`${product.optionId}-${selectedVariantId}`}
                    className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-gray-100">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="font-medium text-gray-900">
                            <Link
                              href={`/products/${product.slug}?id=${product.optionId}`}
                              className="hover:underline hover:text-brand-primary"
                            >
                              {product.name}
                            </Link>
                          </h3>
                          <p className="font-bold text-gray-900">
                            {formatPrice(displaySubtotal)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.color}{" "}
                          {variant?.size ? `- Size ${variant.size}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-md border bg-gray-50 px-2 py-1">
                          <button
                            className="p-1 text-gray-600 hover:text-black disabled:opacity-50"
                            onClick={() =>
                              updateQuantity(
                                product.optionId,
                                selectedVariantId,
                                quantity - 1
                              )
                            }
                            disabled={quantity <= 1}
                            title="Giảm số lượng"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            className="p-1 text-gray-600 hover:text-black"
                            onClick={() =>
                              updateQuantity(
                                product.optionId,
                                selectedVariantId,
                                quantity + 1
                              )
                            }
                            disabled={quantity >= MAX_PRODUCT}
                            title="Tăng số lượng"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeFromCart(product.optionId, selectedVariantId)
                          }
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-6">
                <Button
                  variant="ghost"
                  className="gap-2 pl-0 hover:pl-2 transition-all"
                  asChild
                >
                  <Link href="/products">
                    <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900">
              Tổng quan đơn hàng
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">
                  Tạm tính ({totalItems} sản phẩm)
                </span>
                <span className="font-medium text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-xl font-bold text-brand-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right">
                Đã bao gồm VAT nếu có
              </p>

              {!isCheckingOut && (
                <Button
                  className="w-full bg-brand-primary hover:bg-brand-secondary"
                  size="lg"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Tiến hành thanh toán
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
