"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts, Product } from "./use-product";
import { productService } from "../services/product.service";
import { toast } from "sonner";

export function useProductPage() {
  const router = useRouter();
  const { products, loading, nextCursor, fetchProducts, refresh } = useProducts();

  // State
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  // Sort date is likely a param like sort='createAt,desc'. 
  const [sortDate, setSortDate] = useState<boolean>(true); // true = desc, false = asc toggle for example

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination State
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  // Initial fetch
  useEffect(() => {
    fetchProducts({
      search: searchQuery,
      category_id: categoryId,
      // TODO: Map sortDate to actual API sort param if exists
      // sort: sortDate ? 'createdAt,desc' : 'createdAt,asc' 
    });
  }, [fetchProducts, searchQuery, categoryId, sortDate]);

  const handleSearch = (value: string) => {
    if (value === '') {
      setSearchQuery(undefined);
    } else {
      setSearchQuery(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === 'all' ? undefined : value);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleSortDateToggle = () => {
    setSortDate(prev => !prev);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  }

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
      fetchProducts({
        cursor: nextCursor,
        search: searchQuery,
        category_id: categoryId
      });
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;

    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();

    setCursorHistory(newHistory);
    setCurrentCursor(prevCursor);
    fetchProducts({
      cursor: prevCursor,
      search: searchQuery,
      category_id: categoryId
    });
  };

  const handleRefresh = () => {
    refresh();
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleView = (product: Product) => {
    router.push(`/admin/products/${product.id}`);
  };

  const handleCreate = () => {
    router.push(`/admin/products/create`); // Or open a modal if preferred
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setActionLoading(true);
    try {
      await productService.delete(productToDelete.id);
      setIsDeleteOpen(false);
      setProductToDelete(null);
      handleRefresh();
      toast.success('Product deleted successfully');
    } catch (e) {
      toast.error("Failed to delete product");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    products,
    loading,
    nextCursor,
    searchQuery,
    categoryId,
    sortDate,
    isDeleteOpen,
    setIsDeleteOpen,
    productToDelete,
    actionLoading,
    refresh: handleRefresh,
    canPrev: cursorHistory.length > 0,
    handleSearch,
    handleCategoryChange,
    handleSortDateToggle,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleCreate,
    handleDeleteClick,
    handleConfirmDelete,
  };
}
