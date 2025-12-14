"use client";

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { ORDER_STATUS_COLORS, OrderStatus } from "../types/order.type";
import { OrderHistoryDetailItem } from "./order-history-detail-item";
import { useOrderDetail } from "../hooks/use-order-detail";
import { Separator } from "@/components/ui";

interface OrderHistoryDetailProps {
  orderCode: string;
}

export function OrderHistoryDetail({ orderCode }: OrderHistoryDetailProps) {
  const { order, loading, error, handleRefund, handleReOrder } = useOrderDetail(orderCode);

  if (loading) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="text-center py-12 text-destructive">
        {error || "Order not found"}
      </div>
    );
  }

  const statusColor =
    ORDER_STATUS_COLORS[order.status as OrderStatus] ||
    "bg-gray-100 text-gray-800";

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      {/* Back Button */}
      <div className="flex-shrink-0">
        <Link
          href="/orders-history"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 mt-6">
        {/* Left Column: Order Items List */}
        <div className="lg:col-span-2 h-2/3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b flex-shrink-0">
              <CardTitle className="text-lg">Danh sách sản phẩm</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Scrollable List Container */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {order.orderDetails.map((item) => (
                  <OrderHistoryDetailItem key={item.orderDetailId} item={item} />
                ))}
              </div>

              {/* Total Price Section - Moved to bottom of left column */}
              <div className="p-6 border-t bg-muted/10 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Tổng tiền</span>
                  <span className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Information */}
        <div className="h-2/3">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b bg-muted/30 flex-shrink-0">
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-6 p-4 bg-muted/20 rounded-lg">
                  <span className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mã đơn hàng</div>
                    <div className="font-mono font-medium">{order.orderCode}</div>
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Trạng thái</div>
                    <Badge className={`${statusColor} hover:${statusColor}`}>
                      {order.status}
                    </Badge>
                  </span>

                  <Separator />

                  {/* Recipient */}
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Thời gian đặt hàng</div>
                      <div className="text-muted-foreground text-sm">{new Intl.DateTimeFormat("vi-VN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(order.createdAt))}</div>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Người nhận</div>
                      <div className="text-muted-foreground text-sm">{order.recipientName}</div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Số điện thoại</div>
                      <div className="text-muted-foreground text-sm">{order.phoneNumber}</div>
                    </div>
                  </div>

                  {/* Email */}
                  {order.email && (
                    <div className="flex items-start gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium text-sm">Email</div>
                        <div className="text-muted-foreground text-sm">{order.email}</div>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Địa chỉ giao hàng</div>
                      <div className="text-muted-foreground text-sm leading-relaxed">
                        {order.shippingAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-muted/10 flex-shrink-0 flex gap-3">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleRefund}
                >
                  Yêu cầu trả hàng
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleReOrder}
                >
                  Mua lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
