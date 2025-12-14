import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import {
  IDashboardRepository,
  DashboardQueryParam,
  DashboardStatItem,
  DashboardOrderOptions,
} from '@/core/dashboard/interfaces';
import { EOrderStatus } from '@/core/order/enums';

@Injectable()
export class PrismaDashboardRepository implements IDashboardRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getOrdersStats(
    params: DashboardQueryParam,
    options?: DashboardOrderOptions
  ): Promise<DashboardStatItem[]> {
    const { startDate, endDate, groupBy } = params;
    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        TO_CHAR(created_at, ${dateFormat}::text) as date, 
        COUNT(*)::int as value
      FROM "orders"
      WHERE 
        created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND status IN (${options?.status || EOrderStatus.DELIVERED})
      GROUP BY TO_CHAR(created_at, ${dateFormat}::text), created_at
      ORDER BY created_at ASC
    `;

    return result.map((item) => ({
      date: item.date,
      value: Number(item.value),
    }));
  }

  async getRevenueStats(
    params: DashboardQueryParam,
  ): Promise<DashboardStatItem[]> {
    const { startDate, endDate, groupBy } = params;
    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    // Exclude CANCELED, RETURNED, and PENDING_PAYMENT for revenue
    const result = await this.prisma.$queryRaw<any[]>`
      SELECT 
        TO_CHAR(created_at, ${dateFormat}::text) as date, 
        SUM(total_price)::float as value
      FROM "orders"
      WHERE 
        created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND status IN (${EOrderStatus.DELIVERED})
      GROUP BY TO_CHAR(created_at, ${dateFormat}::text), created_at
      ORDER BY created_at ASC
    `;

    return result.map((item) => ({
      date: item.date,
      value: Number(item.value),
    }));
  }

  async getNewUserStats(
    params: DashboardQueryParam,
  ): Promise<DashboardStatItem[]> {
    const { startDate, endDate, groupBy } = params;
    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' : 'YYYY-MM';

    const result = await this.prisma.$queryRaw<any[]>`
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
}
