import { OrderEntity } from '../entities';

export interface IOrderRepository {
  create(orderData: OrderEntity): Promise<OrderEntity>;
  findById(orderId: string): Promise<OrderEntity | null>;
  findByCode(orderCode: string): Promise<OrderEntity | null>;
  findAll(query: Record<string, any>): Promise<OrderEntity[]>;
  update(orderId: string, updateData: OrderEntity): Promise<OrderEntity>;
  delete(orderId: string): Promise<boolean>;
}

export const ORDER_REPOSITORY = Symbol('IOrderRepository');
