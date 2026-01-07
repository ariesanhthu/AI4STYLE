import { CreateOrderDto, GetListOfOrdersQueryDto, UpdateOrderStatusDto } from '../dtos';
import { type IOrderRepository } from '@/core/order/interfaces';
import { EOrderStatus } from '@/core/order/enums';
import { ILoggerService } from '@/shared/interfaces';
import { IUnitOfWork } from '@/application/shared';
export declare class OrderService {
    private readonly orderRepository;
    private readonly logger;
    private readonly unitOfWork;
    constructor(orderRepository: IOrderRepository, logger: ILoggerService, unitOfWork: IUnitOfWork);
    getById(orderId: string): Promise<{}>;
    getByCode(orderCode: string): Promise<{}>;
    getListOfOrders(query: GetListOfOrdersQueryDto): Promise<{
        items: {
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
        }[];
        nextCursor: string | null;
    }>;
    createOrder(userId: string, orderData: CreateOrderDto): Promise<{
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
    }>;
    updateOrderStatus(orderId: string, body: UpdateOrderStatusDto): Promise<{
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
    }>;
    private cancelOrder;
    deleteOrder(orderId: string): Promise<{
        success: boolean;
    }>;
    private validateStatusTransition;
}
