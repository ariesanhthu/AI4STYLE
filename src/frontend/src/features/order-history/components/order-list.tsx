'use client';

import { useOrders } from '../hooks/use-orders';
import { OrderCard } from './order-card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';

export const OrderList = () => {
  const { orders, isLoading, error, hasMore, hasPrev, goToNextPage, goToPrevPage, refresh } = useOrders();

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="h-8 w-8 text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lỗi khi tải đơn hàng: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!
        </p>
        <Button asChild>
          <Link href="/shop">Khám phá sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">
          Đơn hàng của bạn ({orders.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      {(hasPrev || hasMore) && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevPage}
            disabled={!hasPrev || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Trang trước
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!hasMore || isLoading}
          >
            Trang sau
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
