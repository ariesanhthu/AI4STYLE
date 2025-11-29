import { Module } from '@nestjs/common';
import {
  DASHBOARD_REPOSITORY,
  IDashboardRepository,
} from '@/core/dashboard/interfaces';
import { InfrastructureModule } from '@/infrastructure/infrastructure.module';
import { DashboardService } from '@/application/dashboard/services/dashboard.service';
import { DashboardAdminController } from '@/presentation/controllers/dashboard/dashboard.controller';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';

@Module({
  imports: [InfrastructureModule],
  controllers: [DashboardAdminController],
  providers: [
    {
      provide: DashboardService,
      useFactory: (
        dashboardRepository: IDashboardRepository,
        logger: ILoggerService,
      ) => {
        return new DashboardService(dashboardRepository, logger);
      },
      inject: [DASHBOARD_REPOSITORY, LOGGER_SERVICE],
    },
  ],
  exports: [DashboardService],
})
export class DashboardModule { }
