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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDashboardRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const enums_1 = require("../../../core/order/enums");
let PrismaDashboardRepository = class PrismaDashboardRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrdersStats(params, options) {
        const { startDate, endDate, groupBy } = params;
        const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';
        const result = await this.prisma.$queryRaw `
      SELECT 
        TO_CHAR(created_at, ${dateFormat}::text) as date, 
        COUNT(*)::int as value
      FROM "orders"
      WHERE 
        created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND status IN (${options?.status || enums_1.EOrderStatus.DELIVERED})
      GROUP BY TO_CHAR(created_at, ${dateFormat}::text), created_at
      ORDER BY created_at ASC
    `;
        return result.map((item) => ({
            date: item.date,
            value: Number(item.value),
        }));
    }
    async getRevenueStats(params) {
        const { startDate, endDate, groupBy } = params;
        const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';
        const result = await this.prisma.$queryRaw `
      SELECT 
        TO_CHAR(created_at, ${dateFormat}::text) as date, 
        SUM(total_price)::float as value
      FROM "orders"
      WHERE 
        created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND status IN (${enums_1.EOrderStatus.DELIVERED})
      GROUP BY TO_CHAR(created_at, ${dateFormat}::text), created_at
      ORDER BY created_at ASC
    `;
        return result.map((item) => ({
            date: item.date,
            value: Number(item.value),
        }));
    }
    async getNewUserStats(params) {
        const { startDate, endDate, groupBy } = params;
        const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';
        const result = await this.prisma.$queryRaw `
      SELECT 
        TO_CHAR(created_at, ${dateFormat}::text) as date, 
        COUNT(*)::int as value
      FROM "users"
      WHERE 
        created_at >= ${startDate} 
        AND created_at <= ${endDate}
      GROUP BY TO_CHAR(created_at, ${dateFormat}::text), created_at
      ORDER BY created_at ASC
    `;
        return result.map((item) => ({
            date: item.date,
            value: Number(item.value),
        }));
    }
};
exports.PrismaDashboardRepository = PrismaDashboardRepository;
exports.PrismaDashboardRepository = PrismaDashboardRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDashboardRepository);
//# sourceMappingURL=prisma-dashboard.repository.js.map