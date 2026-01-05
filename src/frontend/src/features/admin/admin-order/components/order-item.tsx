import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "../types";
import { Badge } from "@/components/ui/badge";

interface OrderItemProps {
  order: Order;
  onView: (order: Order) => void;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export function OrderItem({ order, onView, onStatusUpdate }: OrderItemProps) {
  // Format currency
  // const formattedPrice = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // }).format(order.totalPrice || 0);

  return (
    // Red border/shadow style per sketch
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-2xl  hover:border-red-200">
      <CardContent className="p-3 pl-4 flex items-center gap-4">

        {/* Order Info */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          <div className="font-semibold text-lg hover:underline cursor-pointer" onClick={() => onView(order)}>
            {order.code}
          </div>
          {/* Price removed as per request */}

          <div>
            <Select
              value={order.status}
              onValueChange={(val) => onStatusUpdate(order.id, val)}
              disabled={order.status === 'CANCELED' || order.status === 'REFUNDED' || order.status === 'FAILED'}
            >
              <SelectTrigger
                className={`w-[140px] h-8 border-none focus:ring-0 font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-900' :
                  order.status === 'CAPTURED' || order.status === 'COMPLETED' ? 'bg-green-100 text-green-900' :
                    order.status === 'CANCELED' || order.status === 'FAILED' ? 'bg-red-100 text-red-900' :
                      order.status === 'REFUNDED' ? 'bg-orange-100 text-orange-900' :
                        'bg-gray-100'
                  }`}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {/* Only allow actions if current status permits? Assuming simplified flow for now */}
                <SelectItem value="PENDING" disabled className="bg-yellow-100 focus:bg-yellow-200 text-yellow-900 mb-1">Pending</SelectItem>
                <SelectItem value="CAPTURED" disabled className="bg-green-100 focus:bg-green-200 text-green-900 mb-1">Captured</SelectItem>
                <SelectItem value="CANCELED" className="bg-red-100 focus:bg-red-200 text-red-900 mb-1">Cancel</SelectItem>
                <SelectItem value="REFUNDED" className="bg-orange-100 focus:bg-orange-200 text-orange-900">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            {/* Redundant status display removed or replaced */}
            {/* <Badge variant="outline" className="border-gray-200">
              {order.paymentStatus || 'UNPAID'}
            </Badge> */}
            <span className="text-sm text-gray-500 font-medium">{order.type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
