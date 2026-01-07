import type { IDashboardRepository } from '@/core/dashboard/interfaces';
import { GetDashboardStatsDto, DashboardDto, ExportDashboardReportDto } from '@/application/dashboard/dtos';
import type { ILoggerService } from '@/shared/interfaces';
export declare class DashboardService {
    private readonly dashboardRepository;
    private readonly logger;
    private readonly chartRenderer;
    constructor(dashboardRepository: IDashboardRepository, logger: ILoggerService);
    private registerHelpers;
    private generateChart;
    exportReport(data: ExportDashboardReportDto): Promise<Buffer>;
    getOrderStatistics(query: GetDashboardStatsDto): Promise<DashboardDto>;
    getRevenueStatistics(query: GetDashboardStatsDto): Promise<DashboardDto>;
    private fillMissingDates;
}
