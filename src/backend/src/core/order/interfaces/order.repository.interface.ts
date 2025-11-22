import { OrderEntity } from '../entities';

export interface IOrderRepository {
  creaeteOrder(orderData: OrderEntity): Promise<OrderEntity>;
  findOrderById(orderId: string): Promise<OrderEntity | null>;
  findOrderByCode(orderCode: string): Promise<OrderEntity | null>;
  findOrdersByQuery(query: Record<string, any>): Promise<OrderEntity[]>;
  updateOrder(orderId: string, updateData: OrderEntity): Promise<OrderEntity>;
  deleteOrder(orderId: string): Promise<boolean>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
