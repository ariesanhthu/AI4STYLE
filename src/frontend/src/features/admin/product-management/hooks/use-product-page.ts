import { useState, useEffect } from "react";
import { useProducts } from "./use-products";
import productService from "../services/product.service";
import { Product } from "../types/product.type";
import { toast } from "sonner";

export function useProductPage() {
  const { products, loading, nextCursor, fetchProducts, refresh } = useProducts();

  // Filter State
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  // NOTE: confirm if API supports sorting by date natively.
  // The API spec showed get all products ... we need to check if it supports sorting.
  // Assuming it might not, or default is fine. The user asked for "Sort Date".
  // If API doesn't support it, we might need to sort locally or ignore for now.
  // I'll add the state but might rely on backend default for now.

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // View State (List or Create/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Pagination State
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  // Initial fetch
  useEffect(() => {
    fetchProducts({
      limit: 10 as any,
      cursor: currentCursor,
      search: searchQuery
    });
  }, [fetchProducts, currentCursor, searchQuery, categoryId]);

  const handleSearch = (value: string) => {
    setSearchQuery(value || undefined);
    setCursorHistory([]);
    setCurrentCursor(undefined);
  };

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = async (product: Product) => {
    const product_details = await productService.getProductById(product.productId);
    setEditingProduct(product_details.data);
    setIsFormOpen(true);
    console.log("Editing Product:", editingProduct);
  };

  const handleBackToList = () => {
    console.log("Editing Product:", editingProduct);
    setIsFormOpen(false);
    setEditingProduct(undefined);
    refresh(); // Refresh list to show new/updated items
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setCursorHistory((prev) => [...prev, currentCursor]);
      setCurrentCursor(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorHistory.length === 0) return;
    const newHistory = [...cursorHistory];
    const prevCursor = newHistory.pop();
    setCursorHistory(newHistory);
    setCurrentCursor(prevCursor);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setActionLoading(true);
    try {
      await productService.deleteProduct(productToDelete.productId);
      toast.success("Product deleted successfully");
      setIsDeleteOpen(false);
      setProductToDelete(null);
      refresh();
    } catch (error) {
      console.error(error);
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
    isDeleteOpen,
    setIsDeleteOpen,
    productToDelete,
    actionLoading,
    refresh,
    canPrev: cursorHistory.length > 0,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    isFormOpen,
    handleBackToList,
    editingProduct
  };
}
