import { DashboardService } from '@/application/dashboard/services/dashboard.service';
import { type GetDashboardStatsDto, type ExportDashboardReportDto } from '@/application/dashboard/dtos';
import type { Response } from 'express';
export declare class DashboardAdminController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOrderStatistics(query: GetDashboardStatsDto): Promise<{
        data: {
            x: string;
            y: number;
        }[];
        xLabel: string;
        yLabel: string;
        xType: string;
        yType: string;
    }>;
    getRevenueStatistics(query: GetDashboardStatsDto): Promise<{
        data: {
            x: string;
            y: number;
        }[];
        xLabel: string;
        yLabel: string;
        xType: string;
        yType: string;
    }>;
    exportReport(query: ExportDashboardReportDto, res: Response): Promise<void>;
}
