"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/features/user-cart/context/cart-context";
import { ProductVariant } from "@/features/user-product/types/product";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "./checkout-form";
import { AnimatePresence, motion } from "framer-motion";
import { CartItem } from "./cart-item";

export function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateVariant,
    totalItems,
    clearCart,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    // If variant exists, use variant price, else product price
    const variant = item.product.variants.find(
      (v: ProductVariant) => v.variantId === item.selectedVariantId
    );
    const price = variant ? variant.newPrice : item.product.newPrice;
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
    setIsCheckingOut(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 overflow-hidden min-h-[500px]">
      <motion.div
        layout
        className="flex items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          {isCheckingOut && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCheckingOut(false)}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {isCheckingOut ? "Thanh toán" : "Giỏ hàng"}
          </h1>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3 relative items-start">
        <AnimatePresence mode="popLayout">
          {/* Main Content Area: List OR Checkout Form */}
          {!isCheckingOut ? (
            <motion.div
              key="cart-list"
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.product.optionId}-${item.selectedVariantId}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onUpdateVariant={updateVariant}
                    onRemove={removeFromCart}
                    formatPrice={formatPrice}
                  />
                ))}

                <div className="mt-6 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:pl-2 transition-all"
                    asChild
                  >
                    <Link href="/products">
                      <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa giỏ hàng
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout-form"
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <CheckoutForm
                cartItems={cartItems}
                onCancel={() => setIsCheckingOut(false)}
                onSubmit={handleCheckoutSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Summary - Right Column */}
        <motion.div
          className="lg:col-span-1"
          layout
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-lg border bg-white p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-medium text-gray-900">
              Tổng quan đơn hàng
            </h2>

            {/* Animated Mini Cart List when Checking Out */}
            <AnimatePresence>
              {isCheckingOut && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 mb-4 border-b pb-4 overflow-hidden"
                >
                  <div className="max-h-[300px] overflow-y-auto space-y-3 p-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {cartItems.map((item) => (
                      <CartItem
                        key={`${item.product.optionId}-${item.selectedVariantId}`}
                        item={item}
                        isMini
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
        </motion.div>
      </div>
    </div>
  );
}
