import type {
  IDashboardRepository,
} from '@/core/dashboard/interfaces';
import {
  GetDashboardStatsDto,
  DashboardDto,
  ExportDashboardReportDto,
} from '@/application/dashboard/dtos';
import type { ILoggerService } from '@/shared/interfaces';
import * as hbs from 'hbs';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export class DashboardService {
  constructor(
    private readonly dashboardRepository: IDashboardRepository,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(DashboardService.name);
    this.registerHelpers();
  }

  private registerHelpers() {
    hbs.handlebars.registerHelper('formatCurrency', (value: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(value);
    });

    hbs.handlebars.registerHelper('formatDate', (date: Date) => {
      return new Date(date).toLocaleDateString('vi-VN');
    });
  }

  async exportReport(data: ExportDashboardReportDto): Promise<Buffer> {
    try {
      let startDate: Date;
      let endDate: Date;
      let groupBy: 'day' | 'month';
      let reportTitle: string;

      if (data.type === 'year') {
        groupBy = 'month';
        startDate = new Date(data.value, 0, 1);
        endDate = new Date(data.value, 11, 31);
        reportTitle = `Year ${data.value}`;
      } else {
        groupBy = 'day';
        const year = data.year || new Date().getFullYear();
        // Month is 1-indexed in input, 0-indexed in Date
        startDate = new Date(year, data.value - 1, 1);
        endDate = new Date(year, data.value, 0); // Last day of month
        reportTitle = `Month ${data.value}/${year}`;
      }

      const ordersStats = await this.dashboardRepository.getOrdersStats({
        startDate,
        endDate,
        groupBy,
      });

      const revenueStats = await this.dashboardRepository.getRevenueStats({
        startDate,
        endDate,
        groupBy,
      });

      const filledOrders = this.fillMissingDates(ordersStats, startDate, endDate, groupBy);
      const filledRevenue = this.fillMissingDates(revenueStats, startDate, endDate, groupBy);

      // Merge data
      const mergedData = filledOrders.map((orderItem) => {
        const revenueItem = filledRevenue.find(r => r.date === orderItem.date);
        return {
          date: orderItem.date,
          orders: orderItem.value,
          revenue: revenueItem ? revenueItem.value : 0,
        };
      });

      // Calculate totals
      const totalOrders = mergedData.reduce((sum, item) => sum + item.orders, 0);
      const totalRevenue = mergedData.reduce((sum, item) => sum + item.revenue, 0);

      const templatePath = path.join(process.cwd(), 'templates/report.hbs');
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = hbs.handlebars.compile(templateContent);
      const html = template({
        reportTitle,
        totalOrders,
        totalRevenue,
        data: mergedData,
        generatedAt: new Date(),
      });

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({ format: 'A4' });

      await browser.close();

      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error(
        `Failed to export report: ${error.message}`,
        error.stack,
      );
      throw error;
    }
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
