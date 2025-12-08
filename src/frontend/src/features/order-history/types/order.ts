export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  code: string;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrdersResponse {
  data: Order[];
  cursor: {
    next?: string;
    prev?: string;
  };
  hasMore: boolean;
}

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
} as const;

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  shipping: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
} as const;
