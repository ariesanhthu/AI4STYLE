import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IOrderRepository } from '@/core/order/interfaces';
import { OrderEntity } from '@/core/order/entities';
import { GetListOfOrdersQueryDto, OrderResponseDetailDto } from '@/application/order/dtos';
export declare class PrismaOrderRepository implements IOrderRepository {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(orderData: OrderEntity): Promise<OrderEntity>;
    findById(orderId: string): Promise<OrderEntity | null>;
    findByCode(orderCode: string): Promise<OrderEntity | null>;
    findAll(query: GetListOfOrdersQueryDto): Promise<OrderEntity[]>;
    update(orderId: string, updateData: OrderEntity): Promise<OrderEntity>;
    delete(orderId: string): Promise<boolean>;
    findWithDetails(orderId?: string, orderCode?: string): Promise<OrderResponseDetailDto | null>;
    private toEntity;
}
