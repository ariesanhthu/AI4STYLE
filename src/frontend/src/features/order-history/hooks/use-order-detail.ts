"use client";
import { useState, useEffect } from "react";
import { orderService } from "../services/order.service";
import { DetailOrder } from "../types/order.type";
import { useCart } from "@/features/user-cart/context/cart-context";
import { productService } from "@/features/user-product/services/product.service";

export function useOrderDetail(orderCode: string) {
  const [order, setOrder] = useState<DetailOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderByCode(orderCode);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) {
      fetchOrder();
    }
  }, [orderCode]);

  const handleRefund = async () => {
    // Implement refund logic
    console.log("Refund requested");
  };

  const handleReOrder = async () => {
    // Implement re-order logic
    console.log("Re-order requested");
  };

  return {
    order,
    loading,
    error,
    handleRefund,
    handleReOrder,
  };
}
