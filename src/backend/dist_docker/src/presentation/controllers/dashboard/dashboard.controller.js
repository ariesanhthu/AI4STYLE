"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAdminController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("../../../application/dashboard/services/dashboard.service");
const dtos_1 = require("../../../application/dashboard/dtos");
const decorators_1 = require("../../guards/decorators");
const swagger_1 = require("@nestjs/swagger");
const dtos_2 = require("../../../shared/dtos");
const enums_1 = require("../../../shared/enums");
let DashboardAdminController = class DashboardAdminController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getOrderStatistics(query) {
        return this.dashboardService.getOrderStatistics(query);
    }
    async getRevenueStatistics(query) {
        return this.dashboardService.getRevenueStatistics(query);
    }
    async exportReport(query, res) {
        const buffer = await this.dashboardService.exportReport(query);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=report.pdf',
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.DashboardAdminController = DashboardAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.dashboardSchema,
        description: 'Dashboard retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dashboard statistics',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getDashboardStatsSchema),
    (0, common_1.Get)('orders'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getDashboardStatsSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardAdminController.prototype, "getOrderStatistics", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.dashboardSchema,
        description: 'Dashboard retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get dashboard statistics',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getDashboardStatsSchema),
    (0, common_1.Get)('revenue'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getDashboardStatsSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardAdminController.prototype, "getRevenueStatistics", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Export dashboard report',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_1.exportDashboardReportSchema),
    (0, common_1.Get)('export'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.exportDashboardReportSchema)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardAdminController.prototype, "exportReport", null);
exports.DashboardAdminController = DashboardAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.DASHBOARD}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardAdminController);
//# sourceMappingURL=dashboard.controller.js.map