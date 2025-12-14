"use client";

import { useOrderPage } from "../hooks/use-order-page";
import { OrderList } from "./order-list";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { SearchBar } from "@/features/admin/components/search-bar";

export function OrderManagement() {
  const {
    orders,
    loading,
    nextCursor,
    sortDate,
    handleSortDateToggle,
    isDeleteOpen,
    setIsDeleteOpen,
    orderToDelete,
    actionLoading,
    handleSearch,
    handleNextPage,
    handlePrevPage,
    handleView,
    handleDeleteClick,
    handleConfirmDelete,
    canPrev,
  } = useOrderPage();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order</h1>
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
        </div>
        <div className="relative flex-1">
          <SearchBar
            placeholder="search bar"
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      <OrderList
        orders={orders}
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
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order #{orderToDelete?.code}? This action cannot be undone.
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
