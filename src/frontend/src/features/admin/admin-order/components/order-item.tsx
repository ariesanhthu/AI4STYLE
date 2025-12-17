"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Order } from "../types";
import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  order: Order;
  onView: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export function OrderItem({ order, onView, onDelete }: OrderItemProps) {
  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(order.totalPrice || 0);

  // Status Colors (Mock logic)
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    // Red border/shadow style per sketch
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-2xl  hover:border-red-200">
      <CardContent className="p-3 pl-4 flex items-center gap-4">

        {/* Order Info */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          <div className="font-semibold text-lg text-white-80">
            {order.code}
          </div>
          <div className="text-gray-400 font-medium">
            {formattedPrice}
          </div>
          <div>
            <Badge variant="outline" className={`${getStatusColor(order.status)} border-0`}>
              {order.status || 'PENDING'}
            </Badge>
          </div>
          <div>
            <Badge variant="outline" className="border-gray-200">
              {order.paymentStatus || 'UNPAID'}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" className="hover:text-blue-600" onClick={() => onView(order)}>
            <Edit className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="hover:text-red-600" onClick={() => onDelete(order)}>
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
