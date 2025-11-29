import type {
  IDashboardRepository,
} from '@/core/dashboard/interfaces';
import {
  GetDashboardStatsDto,
  DashboardDto,
} from '@/application/dashboard/dtos';
import type { ILoggerService } from '@/shared/interfaces';

export class DashboardService {
  constructor(
    private readonly dashboardRepository: IDashboardRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(DashboardService.name);
  }

  async getOrderStatistics(query: GetDashboardStatsDto): Promise<DashboardDto> {
    try {
      let startDate: Date;
      let endDate: Date;

      if (query.groupBy === 'month') {
        // If groupBy is month, fetch all months for the specified year
        startDate = new Date(query.year!, 0, 1); // Jan 1st of the year
        endDate = new Date(query.year!, 11, 31); // Dec 31st of the year
      } else {
        // If groupBy is day, use provided dates or default to last 30 days
        endDate = query.endDate || new Date();
        startDate = query.startDate || new Date(new Date().setDate(endDate.getDate() - 30));
      }

      const stats = await this.dashboardRepository.getOrdersStats({
        startDate,
        endDate,
        groupBy: query.groupBy,
      });

      const filledStats = this.fillMissingDates(stats, startDate, endDate, query.groupBy);

      return {
        data: filledStats.map((item) => ({
          x: item.date,
          y: item.value,
        })),
        xLabel: 'Date',
        yLabel: 'Orders',
        xType: 'date',
        yType: 'number',
      };
    } catch (error) {
      this.logger.error(
        `Failed to get order statistics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getRevenueStatistics(
    query: GetDashboardStatsDto,
  ): Promise<DashboardDto> {
    try {
      let startDate: Date;
      let endDate: Date;

      if (query.groupBy === 'month') {
        // If groupBy is month, fetch all months for the specified year
        startDate = new Date(query.year!, 0, 1); // Jan 1st of the year
        endDate = new Date(query.year!, 11, 31); // Dec 31st of the year
      } else {
        // If groupBy is day, use provided dates or default to last 30 days
        endDate = query.endDate || new Date();
        startDate = query.startDate || new Date(new Date().setDate(endDate.getDate() - 30));
      }

      const stats = await this.dashboardRepository.getRevenueStats({
        startDate,
        endDate,
        groupBy: query.groupBy,
      });

      const filledStats = this.fillMissingDates(stats, startDate, endDate, query.groupBy);

      return {
        data: filledStats.map((item) => ({
          x: item.date,
          y: item.value,
        })),
        xLabel: 'Date',
        yLabel: 'Revenue',
        xType: 'date',
        yType: 'VND',
      };
    } catch (error) {
      this.logger.error(
        `Failed to get revenue statistics: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private fillMissingDates(
    stats: { date: string; value: number }[],
    startDate: Date,
    endDate: Date,
    groupBy: 'day' | 'month',
  ): { date: string; value: number }[] {
    const filledStats: { date: string; value: number }[] = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
      let dateString: string;
      if (groupBy === 'day') {
        dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        dateString = currentDate.toISOString().slice(0, 7); // YYYY-MM
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const existingStat = stats.find((stat) => stat.date === dateString);
      filledStats.push({
        date: dateString,
        value: existingStat ? existingStat.value : 0,
      });
    }

    return filledStats;
  }
}
