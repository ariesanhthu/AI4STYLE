import { Controller, Get, Res } from '@nestjs/common';
import { DashboardService } from '@/application/dashboard/services/dashboard.service';
import {
  dashboardSchema,
  type GetDashboardStatsDto,
  getDashboardStatsSchema,
  exportDashboardReportSchema,
  type ExportDashboardReportDto,
} from '@/application/dashboard/dtos';
import { ApiZodErrorResponse, ApiZodQuery, ApiZodResponse, ZodQuery } from '@/presentation/guards/decorators';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { errorResponseSchema } from '@/shared/dtos';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import type { Response } from 'express';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.DASHBOARD}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('dashboard')
export class DashboardAdminController {
  constructor(private readonly dashboardService: DashboardService) { }

  @ApiZodResponse({
    status: 200,
    schema: dashboardSchema,
    description: 'Dashboard retrieved successfully',
  })
  @ApiOperation({
    summary: 'Get dashboard statistics',
  })
  @ApiZodQuery(getDashboardStatsSchema)
  @Get('orders')
  async getOrderStatistics(@ZodQuery(getDashboardStatsSchema) query: GetDashboardStatsDto) {
    return this.dashboardService.getOrderStatistics(query);
  }

  @ApiZodResponse({
    status: 200,
    schema: dashboardSchema,
    description: 'Dashboard retrieved successfully',
  })
  @ApiOperation({
    summary: 'Get dashboard statistics',
  })
  @ApiZodQuery(getDashboardStatsSchema)
  @Get('revenue')
  async getRevenueStatistics(@ZodQuery(getDashboardStatsSchema) query: GetDashboardStatsDto) {
    return this.dashboardService.getRevenueStatistics(query);
  }

  @ApiOperation({
    summary: 'Export dashboard report',
  })
  @ApiZodQuery(exportDashboardReportSchema)
  @Get('export')
  async exportReport(
    @ZodQuery(exportDashboardReportSchema) query: ExportDashboardReportDto,
    @Res() res: Response
  ) {
    const buffer = await this.dashboardService.exportReport(query);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=report.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}
