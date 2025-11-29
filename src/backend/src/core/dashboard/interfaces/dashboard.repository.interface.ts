export interface DashboardQueryParam {
  startDate: Date;
  endDate: Date;
  groupBy: 'day' | 'month';
}

export interface DashboardStatItem {
  date: string;
  value: number;
}

export interface IDashboardRepository {
  getOrdersStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
  getRevenueStats(params: DashboardQueryParam): Promise<DashboardStatItem[]>;
}

export const DASHBOARD_REPOSITORY = Symbol('IDashboardRepository');