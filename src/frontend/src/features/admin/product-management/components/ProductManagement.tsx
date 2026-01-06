"use client";

import { useProductPage } from "../hooks/use-product-page";
import { ProductList } from "./ProductList";
import { ProductForm } from "./ProductForm";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, ArrowLeft } from "lucide-react";
import { SearchBar } from "@/features/admin/components";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductManagement() {
  const {
    products,
    loading,
    nextCursor,
    isDeleteOpen,
    setIsDeleteOpen,
    productToDelete,
    actionLoading,
    refresh,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    editingProduct,
    canPrev,
    isFormOpen,
    handleBackToList,
  } = useProductPage();

  if (isFormOpen) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        {/* We can pass editingProduct here in the future to support Edit mode */}
        <ProductForm onSuccess={handleBackToList} editingProduct={editingProduct} />
      </div>
    );
  }

  return (
    <div className="admin-page-container space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm, lựa chọn và tùy chọn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={refresh} title="Refresh">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <div className="flex-1 max-w-sm">
            <SearchBar onSearch={handleSearch} placeholder="Search products..." />
          </div>
          {/* Sorting and Category Filters can be added here as Select components if needed */}

          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <ProductList
        products={products}
        loading={loading}
        nextCursor={nextCursor}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        canPrev={canPrev}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{productToDelete?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
            >
              {actionLoading && <span className="mr-2 animate-spin">⏳</span>}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
