import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { IDashboardRepository, DashboardQueryParam, DashboardStatItem, DashboardOrderOptions } from '@/core/dashboard/interfaces';
export declare class PrismaDashboardRepository implements IDashboardRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getOrdersStats(params: DashboardQueryParam, options?: DashboardOrderOptions): Promise<DashboardStatItem[]>;
    getRevenueStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
    getNewUserStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
}
