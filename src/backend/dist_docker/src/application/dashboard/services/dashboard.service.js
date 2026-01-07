"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const hbs = __importStar(require("hbs"));
const puppeteer = __importStar(require("puppeteer"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const enums_1 = require("../../../core/order/enums");
class DashboardService {
    dashboardRepository;
    logger;
    chartRenderer = new chartjs_node_canvas_1.ChartJSNodeCanvas({
        width: 800,
        height: 400,
        backgroundColour: 'white'
    });
    constructor(dashboardRepository, logger) {
        this.dashboardRepository = dashboardRepository;
        this.logger = logger;
        this.logger.setContext(DashboardService.name);
        this.registerHelpers();
    }
    registerHelpers() {
        hbs.handlebars.registerHelper('formatCurrency', (value) => {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            }).format(value);
        });
        hbs.handlebars.registerHelper('formatDate', (date) => {
            return new Date(date).toLocaleDateString('vi-VN');
        });
    }
    async generateChart(labels, datasets, type = 'line') {
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
        return (await this.chartRenderer.renderToBuffer(configuration)).toString('base64');
    }
    async exportReport(data) {
        try {
            let startDate;
            let endDate;
            let groupBy;
            let reportTitle;
            if (data.type === 'year') {
                groupBy = 'month';
                startDate = new Date(data.value, 0, 1);
                endDate = new Date(data.value, 11, 31);
                reportTitle = `Năm ${data.value}`;
            }
            else {
                groupBy = 'day';
                const year = data.year || new Date().getFullYear();
                startDate = new Date(year, data.value - 1, 1);
                endDate = new Date(year, data.value, 0);
                reportTitle = `Tháng ${data.value}/${year}`;
            }
            const deliveredStatsResponse = await this.dashboardRepository.getOrdersStats({ startDate, endDate, groupBy }, { status: enums_1.EOrderStatus.DELIVERED });
            const returnedStatsResponse = await this.dashboardRepository.getOrdersStats({ startDate, endDate, groupBy }, { status: enums_1.EOrderStatus.RETURNED });
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
            const filledDelivered = this.fillMissingDates(deliveredStatsResponse, startDate, endDate, groupBy);
            const filledReturned = this.fillMissingDates(returnedStatsResponse, startDate, endDate, groupBy);
            const filledRevenue = this.fillMissingDates(revenueStatsResponse, startDate, endDate, groupBy);
            const filledUsers = this.fillMissingDates(newUserStatsResponse, startDate, endDate, groupBy);
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
            const totalDelivered = mergedData.reduce((sum, i) => sum + i.delivered, 0);
            const totalReturned = mergedData.reduce((sum, i) => sum + i.returned, 0);
            const totalRevenue = mergedData.reduce((sum, i) => sum + i.revenue, 0);
            const totalNewUsers = mergedData.reduce((sum, i) => sum + i.newUsers, 0);
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
        }
        catch (error) {
            this.logger.error(`Failed to export report: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getOrderStatistics(query) {
        try {
            let startDate;
            let endDate;
            if (query.groupBy === 'month') {
                startDate = new Date(query.year, 0, 1);
                endDate = new Date(query.year, 11, 31);
            }
            else {
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
        }
        catch (error) {
            this.logger.error(`Failed to get order statistics: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getRevenueStatistics(query) {
        try {
            let startDate;
            let endDate;
            if (query.groupBy === 'month') {
                startDate = new Date(query.year, 0, 1);
                endDate = new Date(query.year, 11, 31);
            }
            else {
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
        }
        catch (error) {
            this.logger.error(`Failed to get revenue statistics: ${error.message}`, error.stack);
            throw error;
        }
    }
    fillMissingDates(stats, startDate, endDate, groupBy) {
        const filledStats = [];
        const currentDate = new Date(startDate);
        const lastDate = new Date(endDate);
        while (currentDate <= lastDate) {
            let dateString;
            if (groupBy === 'day') {
                dateString = currentDate.toISOString().split('T')[0];
                currentDate.setDate(currentDate.getDate() + 1);
            }
            else {
                dateString = currentDate.toISOString().slice(0, 7);
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
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map