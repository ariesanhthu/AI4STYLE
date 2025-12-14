import { type paths } from '@/lib/open-api-client/';

export type GetListOrderDto = paths['/shop/v1/admin/order']['get']['parameters']['query'];
export type UpdateOrderStatusDto = paths['/shop/v1/admin/order/{id}/status']['patch']['requestBody']['content']['application/json'];

// Define Order type based on expected API response or usage
export interface Order {
  id: string;
  code: string;
  totalPrice: number;
  status: string; // e.g. PENDING, SHIPPED
  paymentStatus: string; // e.g. PAID, UNPAID
  createdAt: string;
  [key: string]: any;
}
