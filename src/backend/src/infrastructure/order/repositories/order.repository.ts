import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IOrderRepository } from '@/core/order/interfaces';
import { OrderDetailEntity, OrderEntity } from '@/core/order/entities';
import { GetListOfOrdersQueryDto } from '@/application/order/dtos';

@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly logger = new Logger(OrderRepository.name);

  constructor(private readonly prisma: PrismaService) { }

  async creaeteOrder(orderData: OrderEntity): Promise<OrderEntity> {
    const created = await this.prisma.order.create({
      data: {
        order_id: orderData.orderId,
        user_id: orderData.userId,
        order_code: orderData.orderCode,
        total_price: orderData.totalPrice,
        status: orderData.status,
        recipient_name: orderData.recipientName,
        phone_number: orderData.phoneNumber,
        shipping_address: orderData.shippingAddress,
        email: orderData.email,
        created_at: orderData.createdAt,
        updated_at: orderData.updatedAt,
        orderDetails: {
          create: orderData.orderDetails?.map((detail) => ({
            order_detail_id: detail.orderDetailId,
            variant_id: detail.variantId,
            quantity: detail.quantity,
            price_per_unit: detail.pricePerUnit,
            created_at: detail.createdAt,
            updated_at: detail.updatedAt,
          })),
        },
      },
      include: {
        orderDetails: true,
      },
    });
    return this.toEntity(created);
  }

  async findOrderById(orderId: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        orderDetails: true,
      },
    });
    return order ? this.toEntity(order) : null;
  }

  async findOrderByCode(orderCode: string): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { order_code: orderCode },
      include: {
        orderDetails: true,
      },
    });
    return order ? this.toEntity(order) : null;
  }

  async findOrdersByQuery(
    query: GetListOfOrdersQueryDto,
  ): Promise<OrderEntity[]> {
    const whereClause: any = {};

    // Filter by customer ID if provided
    if (query.customerId) {
      whereClause.user_id = query.customerId;
    }

    // Filter by status if provided
    if (query.status) {
      whereClause.status = query.status;
    }

    // Filter by date range if provided
    if (query.startDate || query.endDate) {
      whereClause.created_at = {};
      if (query.startDate) {
        whereClause.created_at.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereClause.created_at.lte = new Date(query.endDate);
      }
    }

    const orders = await this.prisma.order.findMany({
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { order_id: query.cursor } : undefined,
      where: whereClause,
      orderBy: { created_at: query.sortOrder || 'desc' },
      include: {
        orderDetails: true,
      },
    });

    return orders.map((order) => this.toEntity(order));
  }

  async updateOrder(
    orderId: string,
    updateData: OrderEntity,
  ): Promise<OrderEntity> {
    const updated = await this.prisma.order.update({
      where: { order_id: orderId },
      data: {
        total_price: updateData.totalPrice,
        status: updateData.status,
        recipient_name: updateData.recipientName,
        phone_number: updateData.phoneNumber,
        shipping_address: updateData.shippingAddress,
        email: updateData.email,
        updated_at: updateData.updatedAt,
      },
      include: {
        orderDetails: true,
      },
    });
    return this.toEntity(updated);
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    await this.prisma.order.delete({
      where: { order_id: orderId },
    });
    return true;
  }

  private toEntity(raw: any): OrderEntity {
    const orderDetails = raw.orderDetails?.map(
      (detail: any) =>
        new OrderDetailEntity(
          detail.order_detail_id,
          detail.order_id,
          detail.variant_id,
          detail.quantity,
          detail.price_per_unit,
          detail.created_at,
          detail.updated_at,
        ),
    );

    return new OrderEntity(
      raw.order_id,
      raw.user_id,
      raw.order_code,
      raw.total_price,
      raw.status,
      raw.recipient_name,
      raw.phone_number,
      raw.shipping_address,
      raw.email,
      raw.created_at,
      raw.updated_at,
      orderDetails,
    );
  }
}
