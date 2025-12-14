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
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { EOrderStatus } from '@/core/order/enums';

export class DashboardService {
  private readonly chartRenderer = new ChartJSNodeCanvas({
    width: 800,
    height: 400,
    backgroundColour: 'white' // Important for PDFs!
  });

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

  // Helper to create the chart
  private async generateChart(
    labels: string[],
    datasets: any[],
    type: 'line' | 'bar' = 'line',
  ): Promise<string> {
    const configuration = {
      type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: false,
        plugins: {
          legend: { display: true },
          title: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: [
        {
          id: 'custom_background',
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
          },
        },
      ],
    };

    return (
      await this.chartRenderer.renderToBuffer(configuration as any)
    ).toString('base64');
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
        reportTitle = `Năm ${data.value}`;
      } else {
        groupBy = 'day';
        const year = data.year || new Date().getFullYear();
        startDate = new Date(year, data.value - 1, 1);
        endDate = new Date(year, data.value, 0);
        reportTitle = `Tháng ${data.value}/${year}`;
      }

      // Fetch Statistics
      const deliveredStatsResponse = await this.dashboardRepository.getOrdersStats(
        { startDate, endDate, groupBy },
        { status: EOrderStatus.DELIVERED },
      );

      const returnedStatsResponse = await this.dashboardRepository.getOrdersStats(
        { startDate, endDate, groupBy },
        { status: EOrderStatus.RETURNED },
      );

      const revenueStatsResponse = await this.dashboardRepository.getRevenueStats({
        startDate,
        endDate,
        groupBy,
      });

      const newUserStatsResponse = await this.dashboardRepository.getNewUserStats({
        startDate,
        endDate,
        groupBy,
      });

      // Fill missing dates
      const filledDelivered = this.fillMissingDates(
        deliveredStatsResponse,
        startDate,
        endDate,
        groupBy,
      );
      const filledReturned = this.fillMissingDates(
        returnedStatsResponse,
        startDate,
        endDate,
        groupBy,
      );
      const filledRevenue = this.fillMissingDates(
        revenueStatsResponse,
        startDate,
        endDate,
        groupBy,
      );
      const filledUsers = this.fillMissingDates(
        newUserStatsResponse,
        startDate,
        endDate,
        groupBy,
      );

      // Merge Data for Table
      const mergedData = filledDelivered.map((item) => {
        const returnedItem = filledReturned.find((r) => r.date === item.date);
        const revenueItem = filledRevenue.find((r) => r.date === item.date);
        const userItem = filledUsers.find((r) => r.date === item.date);
        return {
          date: item.date,
          delivered: item.value,
          returned: returnedItem ? returnedItem.value : 0,
          revenue: revenueItem ? revenueItem.value : 0,
          newUsers: userItem ? userItem.value : 0,
        };
      });

      // Totals
      const totalDelivered = mergedData.reduce((sum, i) => sum + i.delivered, 0);
      const totalReturned = mergedData.reduce((sum, i) => sum + i.returned, 0);
      const totalRevenue = mergedData.reduce((sum, i) => sum + i.revenue, 0);
      const totalNewUsers = mergedData.reduce((sum, i) => sum + i.newUsers, 0);

      // Generate Charts
      const labels = mergedData.map((d) => d.date);

      const orderChartImage = await this.generateChart(labels, [
        {
          label: 'Đơn hàng thành công',
          data: mergedData.map((d) => d.delivered),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Đơn hàng hoàn trả',
          data: mergedData.map((d) => d.returned),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          tension: 0.1,
        },
      ]);

      const revenueChartImage = await this.generateChart(labels, [
        {
          label: 'Doanh thu (VND)',
          data: mergedData.map((d) => d.revenue),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.1,
        },
      ]);

      const userChartImage = await this.generateChart(labels, [
        {
          label: 'Người dùng mới',
          data: mergedData.map((d) => d.newUsers),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
          tension: 0.1,
        },
      ]);

      // Compile Template
      const templatePath = path.join(process.cwd(), 'templates/report.hbs');
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = hbs.handlebars.compile(templateContent);

      const html = template({
        reportTitle,
        totalDelivered,
        totalReturned,
        totalRevenue,
        totalNewUsers,
        data: mergedData,
        orderChartImage,
        revenueChartImage,
        userChartImage,
        generatedAt: new Date(),
      });

      // Generate PDF
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      });
      const page = await browser.newPage();
      await page.setContent(html);
      const pdf = await page.pdf({ format: 'A4', printBackground: true });

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
