"use client";

import { useProductPage } from "../hooks/use-product-page";
import { ProductList } from "./product-list";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Tag, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "../../components/search-bar";
import { useCategory } from "../../admin-categories/hooks/use-admin-category";

export function ProductManagement() {
  const {
    products,
    loading,
    nextCursor,
    sortDate,
    handleSortDateToggle,
    isDeleteOpen,
    setIsDeleteOpen,
    productToDelete,
    actionLoading,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleCreate,
    handleDeleteClick,
    handleConfirmDelete,
    canPrev,
    categoryId,
    handleCategoryChange
  } = useProductPage();

  const { data: categories } = useCategory();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product</h1>
        <Button
          className="gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-yellow-200 rounded-xl shadow-sm"
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Filters and Search - Styled to match sketch rounded look */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSortDateToggle}
            className={`gap-2 rounded-xl border-yellow-400/50 text-foreground hover:bg-yellow-50 ${sortDate ? 'bg-yellow-50' : ''}`}
          >
            <Calendar className="h-4 w-4" />
            Sort Date
          </Button>

          <Select
            value={categoryId || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px] rounded-xl border-yellow-400/50 hover:bg-yellow-50">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.categoryId}>
                  <div className="flex items-center gap-2">
                    {/* Indentation for tree structure visual */}
                    {category.level > 0 && <span style={{ marginLeft: `${category.level * 10}px` }}>↳</span>}
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-1">
          <SearchBar
            placeholder="search bar"
            onSearch={handleSearch}
            className="w-full"
          />
          {/* Using SearchBar component instead of direct input for consistency and debouncing if SearchBar supports it */}
          {/* If SearchBar style needs override to match sketch (yellow border), we might need to pass className or modify SearchBar */}
        </div>
      </div>

      <ProductList
        products={products}
        loading={loading}
        nextCursor={nextCursor}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        canPrev={canPrev}
        onView={handleView}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product &quot;{productToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}