import { OrderService } from '@/application/order/services';
import { type CreateOrderDto, type GetListOfOrdersQueryDto } from '@/application/order/dtos';
import { BaseOrderController } from './base-order.controller';
import type { UserInterface } from '@/shared/interfaces';
export declare class OrderClientController extends BaseOrderController {
    protected readonly orderService: OrderService;
    constructor(orderService: OrderService);
    createOrder(body: CreateOrderDto, user: UserInterface): Promise<{
        orderId: string;
        userId: string;
        orderCode: string;
        totalPrice: number;
        status: import("../../../core/order/enums").EOrderStatus;
        recipientName: string;
        phoneNumber: string;
        shippingAddress: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        orderDetails: {
            orderDetailId: string;
            orderId: string;
            variantId: string;
            quantity: number;
            pricePerUnit: number;
            createdAt: Date;
            updatedAt: Date;
            variant: {
                variantId: string;
                optionId: string;
                sku: string;
                size: string;
                price: number;
                newPrice: number | null;
                stockQuantity: number;
                createdAt: Date;
                updatedAt: Date;
                hasDiscount: boolean;
                discountPercentage: number | null;
                inStock: boolean;
                lowStock: boolean;
            } | null;
        }[] | undefined;
    }>;
    getMyOrders(query: GetListOfOrdersQueryDto, user: UserInterface): Promise<{
        items: {
            orderId: string;
            userId: string;
            orderCode: string;
            totalPrice: number;
            status: import("../../../core/order/enums").EOrderStatus;
            recipientName: string;
            phoneNumber: string;
            shippingAddress: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            orderDetails: {
                orderDetailId: string;
                orderId: string;
                variantId: string;
                quantity: number;
                pricePerUnit: number;
                createdAt: Date;
                updatedAt: Date;
                variant: {
                    variantId: string;
                    optionId: string;
                    sku: string;
                    size: string;
                    price: number;
                    newPrice: number | null;
                    stockQuantity: number;
                    createdAt: Date;
                    updatedAt: Date;
                    hasDiscount: boolean;
                    discountPercentage: number | null;
                    inStock: boolean;
                    lowStock: boolean;
                } | null;
            }[] | undefined;
        }[];
        nextCursor: string | null;
    }>;
}
