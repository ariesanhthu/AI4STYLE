import {
  CreateOrderDetailDto,
  CreateOrderDto,
  GetListOfOrdersQueryDto,
  UpdateOrderStatusDto,
} from '../dtos';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { type IOrderRepository } from '@/core/order/interfaces';
import { ProductService } from '@/application/product/services';
import { OrderDetailEntity, OrderEntity } from '@/core/order/entities';
import { EOrderStatus } from '@/core/order/enums';
import { ILoggerService } from '@/shared/interfaces';
import {
  InvalidOrderStatusException,
  OrderCancellationFailedException,
  OrderCreationFailedException,
  OrderNotFoundException,
} from '@/core/order/exceptions';

export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  async getById(orderId: string) {
    try {
      const order = await this.orderRepository.findOrderById(orderId);
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }
      return order.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get order by id ${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getByCode(orderCode: string) {
    try {
      const order = await this.orderRepository.findOrderByCode(orderCode);
      if (!order) {
        throw new OrderNotFoundException(orderCode);
      }
      return order.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to get order by code ${orderCode}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getListOfOrders(query: GetListOfOrdersQueryDto) {
    try {
      query.limit += 1;
      const orders = await this.orderRepository.findOrdersByQuery(query);

      const nextCursor =
        orders.length === query.limit
          ? orders[orders.length - 1].orderId
          : null;

      if (nextCursor) {
        orders.pop();
      }

      return {
        items: orders.map((order) => order.toJSON()),
        nextCursor,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get list of orders: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createOrder(userId: string, orderData: CreateOrderDto) {
    try {
      // Start a transaction
      return await this.prisma.$transaction(async (tx) => {
        // 1. Verify all variants exist and have sufficient stock
        const variantIds = orderData.orderDetails.map(
          (detail) => detail.variantId,
        );
        const variants = await tx.productVariant.findMany({
          where: { variant_id: { in: variantIds } },
        });

        if (variants.length !== variantIds.length) {
          throw new OrderCreationFailedException(
            'Some product variants not found',
          );
        }

        // 2. Check stock availability and calculate total price
        let totalPrice = 0;
        const stockUpdates: { variantId: string; stockChange: number }[] = [];
        const enhancedDetails: (CreateOrderDetailDto & {
          pricePerUnit: number;
        })[] = [];
        for (const detail of orderData.orderDetails) {
          const variant = variants.find(
            (v) => v.variant_id === detail.variantId,
          );
          if (!variant) {
            throw new OrderCreationFailedException(
              `Variant ${detail.variantId} not found`,
            );
          }

          if (variant.stock_quantity < detail.quantity) {
            throw new OrderCreationFailedException(
              `Insufficient stock for variant ${detail.variantId}. Available: ${variant.stock_quantity}, Requested: ${detail.quantity}`,
            );
          }

          totalPrice += (variant.new_price ?? variant.price) * detail.quantity;
          stockUpdates.push({
            variantId: detail.variantId,
            stockChange: -detail.quantity, // Negative to reduce stock
          });
          enhancedDetails.push({
            ...detail,
            pricePerUnit: variant.new_price ?? variant.price,
          });
        }

        // 3. Reduce stock using ProductService
        for (const update of stockUpdates) {
          await tx.productVariant.update({
            where: { variant_id: update.variantId },
            data: {
              stock_quantity: {
                decrement: Math.abs(update.stockChange),
              },
              updated_at: new Date(),
            },
          });
        }

        // 4. Generate unique order code
        const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // 5. Create order entity
        const orderDetails = enhancedDetails.map(
          (detail) =>
            new OrderDetailEntity(
              randomUUID(),
              '', // Will be set by the order
              detail.variantId,
              detail.quantity,
              detail.pricePerUnit,
              new Date(),
              new Date(),
            ),
        );

        const orderEntity = new OrderEntity(
          randomUUID(),
          userId,
          orderCode,
          totalPrice,
          EOrderStatus.PENDING_PAYMENT,
          orderData.recipientName,
          orderData.phoneNumber,
          orderData.shippingAddress,
          orderData.email || null,
          new Date(),
          new Date(),
          orderDetails,
        );

        // 6. Save order to database
        const createdOrder =
          await this.orderRepository.creaeteOrder(orderEntity);

        this.logger.log(`Order created: ${createdOrder.orderId}`);
        return createdOrder.toJSON();
      });
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, body: UpdateOrderStatusDto) {
    try {
      const order = await this.orderRepository.findOrderById(orderId);
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      const { status } = body;

      // If status is CANCELED, call cancelOrder
      if (status === EOrderStatus.CANCELED) {
        return this.cancelOrder(orderId);
      }

      // Check status chain logic
      this.validateStatusTransition(order.status, status);

      // Update status
      order.status = status;
      order.updatedAt = new Date();

      const updatedOrder = await this.orderRepository.updateOrder(
        orderId,
        order,
      );
      this.logger.log(`Order status updated: ${orderId} -> ${status}`);
      return updatedOrder.toJSON();
    } catch (error) {
      this.logger.error(
        `Failed to update order status: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async cancelOrder(orderId: string) {
    try {
      // Start a transaction
      return await this.prisma.$transaction(async (tx) => {
        const order = await this.orderRepository.findOrderById(orderId);
        if (!order) {
          throw new OrderNotFoundException(orderId);
        }

        // Check if order can be canceled
        if (
          order.status === EOrderStatus.DELIVERED ||
          order.status === EOrderStatus.CANCELED
        ) {
          throw new OrderCancellationFailedException(
            `Order with status ${order.status} cannot be canceled`,
          );
        }

        // Restore stock for all order details
        if (order.orderDetails && order.orderDetails.length > 0) {
          const stockUpdates = order.orderDetails.map((detail) => ({
            variantId: detail.variantId,
            stockChange: detail.quantity, // Positive to increase stock
          }));

          await this.productService.modifyProductVariantStock({
            variants: stockUpdates,
          });
        }

        // Update order status to CANCELED
        order.status = EOrderStatus.CANCELED;
        order.updatedAt = new Date();

        const canceledOrder = await this.orderRepository.updateOrder(
          orderId,
          order,
        );
        this.logger.log(`Order canceled: ${orderId}`);
        return canceledOrder.toJSON();
      });
    } catch (error) {
      this.logger.error(
        `Failed to cancel order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async deleteOrder(orderId: string) {
    try {
      const order = await this.orderRepository.findOrderById(orderId);
      if (!order) {
        throw new OrderNotFoundException(orderId);
      }

      // Only allow deletion of CANCELED orders
      if (order.status !== EOrderStatus.CANCELED) {
        throw new InvalidOrderStatusException(
          'Only canceled orders can be deleted',
        );
      }

      await this.orderRepository.deleteOrder(orderId);
      this.logger.log(`Order deleted: ${orderId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to delete order: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Validates if the status transition is allowed
   */
  private validateStatusTransition(
    currentStatus: EOrderStatus,
    newStatus: EOrderStatus,
  ) {
    const validTransitions: Record<EOrderStatus, EOrderStatus[]> = {
      [EOrderStatus.PENDING_PAYMENT]: [
        EOrderStatus.PENDING,
        EOrderStatus.CANCELED,
      ],
      [EOrderStatus.PENDING]: [EOrderStatus.PROCESSING, EOrderStatus.CANCELED],
      [EOrderStatus.PROCESSING]: [EOrderStatus.SHIPPING, EOrderStatus.CANCELED],
      [EOrderStatus.SHIPPING]: [EOrderStatus.DELIVERED, EOrderStatus.RETURNED],
      [EOrderStatus.DELIVERED]: [EOrderStatus.RETURNED],
      [EOrderStatus.CANCELED]: [], // Cannot transition from CANCELED
      [EOrderStatus.RETURNED]: [], // Cannot transition from RETURNED
    };

    const allowedStatuses = validTransitions[currentStatus];
    if (!allowedStatuses.includes(newStatus)) {
      throw new InvalidOrderStatusException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
