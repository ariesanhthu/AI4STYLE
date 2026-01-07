import { EOrderStatus } from '../enums';
import { OrderDetailEntity } from './order-detail.entity';
export declare class OrderEntity {
    readonly orderId: string;
    readonly userId: string;
    readonly orderCode: string;
    totalPrice: number;
    status: EOrderStatus;
    recipientName: string;
    phoneNumber: string;
    shippingAddress: string;
    email: string | null;
    search: string;
    readonly createdAt: Date;
    updatedAt: Date;
    orderDetails?: OrderDetailEntity[] | undefined;
    constructor(orderId: string, userId: string, orderCode: string, totalPrice: number, status: EOrderStatus, recipientName: string, phoneNumber: string, shippingAddress: string, email: string | null, search: string, createdAt: Date, updatedAt: Date, orderDetails?: OrderDetailEntity[] | undefined);
    toJSON(): {
        orderId: string;
        userId: string;
        orderCode: string;
        totalPrice: number;
        status: EOrderStatus;
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
    };
}
