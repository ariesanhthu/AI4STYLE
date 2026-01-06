import { type paths } from '@/lib/open-api-client/';

export type GetListOrderDto = paths['/shop/v1/admin/payments']['get']['parameters']['query'];
export type UpdateOrderStatusDto = paths['/shop/v1/admin/orders/{id}/status']['patch']['requestBody']['content']['application/json'];

export interface Order {
  id: string; // Mapped from paymentId for UI compatibility
  code: string; // Mapped from orderId for UI compatibility
  paymentId: string;
  orderId: string;
  paymentMethodId: string;
  type: string;
  status: string;
  transactions?: any;
  createdAt: string;
  updatedAt: string;
}
