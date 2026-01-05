import { useOrderPage } from "../hooks/use-order-page";
import { OrderList } from "./order-list";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, X } from "lucide-react";
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
import { DatePicker } from "@/components/ui/date-picker";

export function OrderManagement() {
  const {
    orders,
    loading,
    nextCursor,
    sortDate,
    handleSortDateToggle,

    handleNextPage,
    handlePrevPage,
    handleView,
    canPrev,
    status,
    type,
    dateRange,
    handleStatusChange,
    handleTypeChange,
    handleDateRangeChange,
    handleStatusUpdate
  } = useOrderPage();

  const clearFilters = () => {
    handleStatusChange("ALL");
    handleTypeChange("ALL");
    handleDateRangeChange(undefined);
  };

  const hasFilters = status || type || dateRange?.from || dateRange?.to;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Order</h1>
      </div>

      {/* Filters and Search - Styled to match sketch rounded look */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-4 p-4 border rounded-xl bg-card">
          <div className="space-y-2">
            <span className="text-sm font-medium">Status</span>
            <Select value={status || "ALL"} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CAPTURED">Captured</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="CANCELED">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Payment Type</span>
            <Select value={type || "ALL"} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Method</SelectItem>
                <SelectItem value="CASH_ON_DELIVERY">Cash on Delivery</SelectItem>
                <SelectItem value="MOMO">Momo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Start Date</span>
            <DatePicker
              label={undefined}
              date={dateRange?.from}
              onChange={(date) => handleDateRangeChange({ ...dateRange, from: date })}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">End Date</span>
            <DatePicker
              label={undefined}
              date={dateRange?.to}
              onChange={(date) => handleDateRangeChange({ ...dateRange, to: date })}
            />
          </div>

          <div className="flex gap-2 ml-auto pb-0.5">
            <Button
              variant="outline"
              onClick={handleSortDateToggle}
              className={`gap-2 rounded-xl border-yellow-400/50 text-foreground hover:bg-yellow-50 ${sortDate ? 'bg-yellow-50' : ''}`}
            >
              <Calendar className="h-4 w-4" />
              {sortDate ? "Newest" : "Oldest"}
            </Button>

            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear Filters">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
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
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
