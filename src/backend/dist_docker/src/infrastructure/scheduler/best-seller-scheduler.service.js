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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BestSellerSchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestSellerSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const interfaces_1 = require("../../core/product/interfaces");
const enums_1 = require("../../core/order/enums");
let BestSellerSchedulerService = BestSellerSchedulerService_1 = class BestSellerSchedulerService {
    prismaService;
    productRepository;
    logger = new common_1.Logger(BestSellerSchedulerService_1.name);
    constructor(prismaService, productRepository) {
        this.prismaService = prismaService;
        this.productRepository = productRepository;
    }
    async handleBestSellerUpdate() {
        this.logger.log('Starting best seller update job...');
        try {
            const rawSalesData = await this.prismaService.$queryRaw `
        SELECT 
          v.option_id, 
          SUM(od.quantity)::int as total_sold
        FROM order_details od
        JOIN orders o ON od.order_id = o.order_id
        JOIN product_variants v ON od.variant_id = v.variant_id
        WHERE o.status = ${enums_1.EOrderStatus.DELIVERED}
          AND o.created_at >= NOW() - INTERVAL '3 months'
        GROUP BY v.option_id
      `;
            if (rawSalesData.length === 0) {
                this.logger.log('No sales data found to update best sellers.');
                return;
            }
            const updates = rawSalesData.map((item) => ({
                optionId: item.option_id,
                totalSold: item.total_sold,
            }));
            await this.productRepository.updateBestSellers(updates);
            this.logger.log(`Best seller update job completed. Updated ${updates.length} records.`);
        }
        catch (error) {
            this.logger.error(`Failed to update best sellers: ${error.message}`, error.stack);
        }
    }
};
exports.BestSellerSchedulerService = BestSellerSchedulerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_6_HOURS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BestSellerSchedulerService.prototype, "handleBestSellerUpdate", null);
exports.BestSellerSchedulerService = BestSellerSchedulerService = BestSellerSchedulerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(interfaces_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], BestSellerSchedulerService);
//# sourceMappingURL=best-seller-scheduler.service.js.map