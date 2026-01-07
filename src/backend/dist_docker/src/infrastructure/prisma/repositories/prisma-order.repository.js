"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaOrderRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaOrderRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const entities_1 = require("../../../core/order/entities");
let PrismaOrderRepository = PrismaOrderRepository_1 = class PrismaOrderRepository {
    prisma;
    logger = new common_1.Logger(PrismaOrderRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(orderData) {
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
                search: orderData.search,
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
    async findById(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { order_id: orderId },
            include: {
                orderDetails: {
                    include: {
                        variant: {
                            include: {
                                option: true,
                            },
                        },
                    },
                },
            },
        });
        return order ? this.toEntity(order) : null;
    }
    async findByCode(orderCode) {
        const order = await this.prisma.order.findUnique({
            where: { order_code: orderCode },
            include: {
                orderDetails: {
                    include: {
                        variant: {
                            include: {
                                option: true,
                            },
                        },
                    },
                },
            },
        });
        console.log(order?.orderDetails);
        return order ? this.toEntity(order) : null;
    }
    async findAll(query) {
        const whereClause = {};
        if (query.customerId) {
            whereClause.user_id = query.customerId;
        }
        if (query.status) {
            whereClause.status = query.status;
        }
        if (query.startDate || query.endDate) {
            whereClause.created_at = {};
            if (query.startDate) {
                whereClause.created_at.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                whereClause.created_at.lte = new Date(query.endDate);
            }
        }
        if (query.search) {
            whereClause.search = {
                contains: query.search,
                mode: 'insensitive',
            };
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
    async update(orderId, updateData) {
        const updated = await this.prisma.order.update({
            where: { order_id: orderId },
            data: {
                total_price: updateData.totalPrice,
                status: updateData.status,
                recipient_name: updateData.recipientName,
                phone_number: updateData.phoneNumber,
                shipping_address: updateData.shippingAddress,
                search: updateData.search,
                email: updateData.email,
                updated_at: updateData.updatedAt,
            },
            include: {
                orderDetails: true,
            },
        });
        return this.toEntity(updated);
    }
    async delete(orderId) {
        await this.prisma.order.delete({
            where: { order_id: orderId },
        });
        return true;
    }
    async findWithDetails(orderId, orderCode) {
        const order = await this.prisma.order.findUnique({
            where: { order_id: orderId, order_code: orderCode },
            include: {
                orderDetails: {
                    include: {
                        variant: {
                            include: {
                                option: true,
                            },
                        },
                    },
                },
            },
        });
        console.log(order);
        if (!order)
            return null;
        return {
            orderId: order.order_id,
            userId: order.user_id,
            orderCode: order.order_code,
            totalPrice: order.total_price,
            status: order.status,
            recipientName: order.recipient_name,
            phoneNumber: order.phone_number,
            shippingAddress: order.shipping_address,
            email: order.email,
            createdAt: order.created_at.toISOString(),
            updatedAt: order.updated_at.toISOString(),
            orderDetails: order.orderDetails?.map((detail) => ({
                orderDetailId: detail.order_detail_id,
                orderId: detail.order_id,
                variantId: detail.variant_id,
                quantity: detail.quantity,
                pricePerUnit: detail.price_per_unit,
                createdAt: detail.created_at.toISOString(),
                updatedAt: detail.updated_at.toISOString(),
                variant: {
                    name: detail.variant.option.name,
                    variantId: detail.variant.variant_id,
                    sku: detail.variant.sku,
                    size: detail.variant.size,
                    color: detail.variant.option.color,
                    optionId: detail.variant.option_id,
                    thumbnail: detail.variant.option.images[0],
                    slug: detail.variant.option.slug,
                },
            })),
        };
    }
    toEntity(raw) {
        const orderDetails = raw.orderDetails?.map((detail) => new entities_1.OrderDetailEntity(detail.order_detail_id, detail.order_id, detail.variant_id, detail.quantity, detail.price_per_unit, detail.created_at, detail.updated_at));
        return new entities_1.OrderEntity(raw.order_id, raw.user_id, raw.order_code, raw.total_price, raw.status, raw.recipient_name, raw.phone_number, raw.shipping_address, raw.email, raw.search, raw.created_at, raw.updated_at, orderDetails);
    }
};
exports.PrismaOrderRepository = PrismaOrderRepository;
exports.PrismaOrderRepository = PrismaOrderRepository = PrismaOrderRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaOrderRepository);
//# sourceMappingURL=prisma-order.repository.js.map