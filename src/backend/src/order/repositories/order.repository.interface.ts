import { GetListOfOrdersQueryDto } from "../dtos";
import { OrderEntity } from "../entities";

export interface IOrderRepository {
  creaeteOrder(orderData: OrderEntity): Promise<OrderEntity>;
  findOrderById(orderId: string): Promise<OrderEntity | null>;
  findOrderByCode(orderCode: string): Promise<OrderEntity | null>;
  findOrdersByQuery(query: GetListOfOrdersQueryDto): Promise<OrderEntity[]>;
  updateOrder(orderId: string, updateData: OrderEntity): Promise<OrderEntity>;
  deleteOrder(orderId: string): Promise<boolean>;
}