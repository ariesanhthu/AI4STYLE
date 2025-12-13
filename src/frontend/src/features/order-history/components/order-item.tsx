import Link from "next/link";
import { Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderGetMyOrdersResponse, ORDER_STATUS_COLORS, OrderStatus } from "../types/order.type";
import { orderService } from "../services/order.service";

type OrderItemType = Extract<OrderGetMyOrdersResponse['items'], any[]>[number];

interface OrderItemProps {
  order: OrderItemType;
}

export function OrderItem({ order }: OrderItemProps) {
  const statusColor = ORDER_STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100 text-gray-800";

  const handleRefund = async () => {
    await orderService.refundRequest(order.orderId);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{order.orderCode}</TableCell>
      <TableCell>
        {new Intl.DateTimeFormat("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(order.createdAt))}
      </TableCell>
      <TableCell>
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(order.totalPrice)}
      </TableCell>
      <TableCell>
        <Badge className={`${statusColor} hover:${statusColor} border-0`}>
          {order.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/orders-history/${order.orderCode}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Chi tiết đơn hàng</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Chi tiết đơn hàng</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  onClick={handleRefund}
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">Yêu cầu trả hàng</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Yêu cầu trả hàng</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}
