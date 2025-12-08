'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types/order';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Package, Calendar, CreditCard } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">#{order.code}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(order.createdAt)}</span>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={ORDER_STATUS_COLORS[order.status]}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {item.productName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>• Màu: {item.color}</span>}
                  <span>• SL: {item.quantity}</span>
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-xs text-muted-foreground pl-19">
              +{order.items.length - 2} sản phẩm khác
            </p>
          )}
        </div>

        {/* Order Info */}
        <div className="pt-3 border-t border-border space-y-2">
          {order.paymentMethod && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>{order.paymentMethod}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tổng cộng:</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/orders/${order.id}`}>
            Xem chi tiết
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
