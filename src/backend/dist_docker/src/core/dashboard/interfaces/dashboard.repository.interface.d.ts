import { EOrderStatus } from "@/core/order/enums";
export interface DashboardQueryParam {
    startDate: Date;
    endDate: Date;
    groupBy: 'day' | 'month';
}
export interface DashboardStatItem {
    date: string;
    value: number;
}
export interface DashboardOrderOptions {
    status: EOrderStatus;
}
export interface IDashboardRepository {
    getOrdersStats(params: DashboardQueryParam, options?: DashboardOrderOptions): Promise<DashboardStatItem[]>;
    getRevenueStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
    getNewUserStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
}
export declare const DASHBOARD_REPOSITORY: unique symbol;
