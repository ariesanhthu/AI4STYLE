"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "../../user-product/types/product";
import { productService } from "../../user-product/services/product.service";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariantId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  updateVariant: (
    productId: string,
    currentVariantId: string | undefined,
    newVariantId: string
  ) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const MAX_QUANTITY = 10;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  // Enrich product with missing variants
  const enrichProduct = async (optionId: string) => {
    try {
      const fullProduct = await productService.getProductById(optionId);
      if (
        fullProduct &&
        fullProduct.variants &&
        fullProduct.variants.length > 0
      ) {
        setCartItems((prev) => {
          // 1. Update items with full product details and default variant if missing
          const updatedItems = prev.map((item) => {
            if (item.product.optionId === optionId) {
              let selectedVariantId = item.selectedVariantId;
              if (
                !selectedVariantId &&
                fullProduct.variants &&
                fullProduct.variants.length > 0
              ) {
                selectedVariantId = fullProduct.variants[0].variantId;
              }

              return {
                ...item,
                product: fullProduct,
                selectedVariantId: selectedVariantId,
              };
            }
            return item;
          });

          // 2. Consolidate duplicates
          const consolidatedItems: CartItem[] = [];
          updatedItems.forEach((item) => {
            const existingIndex = consolidatedItems.findIndex(
              (i) =>
                i.product.optionId === item.product.optionId &&
                i.selectedVariantId === item.selectedVariantId
            );

            if (existingIndex > -1) {
              // Merge
              consolidatedItems[existingIndex].quantity += item.quantity;
            } else {
              consolidatedItems.push(item);
            }
          });

          return consolidatedItems;
        });
      }
    } catch (err) {
      console.error("Failed to enrich product", err);
    }
  };

  // Check for missing variants on mount
  useEffect(() => {
    if (mounted && cartItems.length > 0) {
      cartItems.forEach((item) => {
        if (!item.product.variants || item.product.variants.length === 0) {
          enrichProduct(item.product.optionId);
        }
      });
    }
  }, [mounted, cartItems]);

  const addToCart = (
    product: Product,
    variantId?: string,
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      // Logic to ensure default variant selection
      let effectiveVariantId = variantId;
      if (
        !effectiveVariantId &&
        product.variants &&
        product.variants.length > 0
      ) {
        effectiveVariantId = product.variants[0].variantId;
      }

      const existingItemIndex = prev.findIndex(
        (item) =>
          item.product.optionId === product.optionId &&
          item.selectedVariantId === effectiveVariantId
      );

      if (existingItemIndex > -1) {
        const newItems = [...prev];
        const currentQuantity = newItems[existingItemIndex].quantity;
        const newQuantity = Math.min(currentQuantity + quantity, MAX_QUANTITY);

        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
        };
        return newItems;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: Math.min(quantity, MAX_QUANTITY),
            selectedVariantId: effectiveVariantId,
          },
        ];
      }
    });

    // Check if we need to fetch full details
    if (!product.variants || product.variants.length === 0) {
      enrichProduct(product.optionId);
    }
  };

  const updateQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.product.optionId === productId &&
          item.selectedVariantId === variantId
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const updateVariant = (
    productId: string,
    currentVariantId: string | undefined,
    newVariantId: string
  ) => {
    setCartItems((prev) => {
      // Find the item being updated
      const itemIndex = prev.findIndex(
        (item) =>
          item.product.optionId === productId &&
          item.selectedVariantId === currentVariantId
      );

      if (itemIndex === -1) return prev;

      const itemToUpdate = prev[itemIndex];
      const newItems = [...prev];

      // Check if the target variant already exists in cart
      const targetItemIndex = prev.findIndex(
        (item) =>
          item.product.optionId === productId &&
          item.selectedVariantId === newVariantId
      );

      if (targetItemIndex > -1 && targetItemIndex !== itemIndex) {
        // Merge: Add quantity to target, remove source
        newItems[targetItemIndex] = {
          ...newItems[targetItemIndex],
          quantity: newItems[targetItemIndex].quantity + itemToUpdate.quantity,
        };
        newItems.splice(itemIndex, 1);
      } else {
        // Update: Just change variant ID
        newItems[itemIndex] = {
          ...itemToUpdate,
          selectedVariantId: newVariantId,
        };
      }

      return newItems;
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.optionId === productId &&
            item.selectedVariantId === variantId
          )
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        updateVariant,
        removeFromCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
