import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@/core/product/interfaces';
import { EOrderStatus } from '@/core/order/enums';

@Injectable()
export class BestSellerSchedulerService {
  private readonly logger = new Logger(BestSellerSchedulerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) { }

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleBestSellerUpdate() {
    this.logger.log('Starting best seller update job...');
    try {
      const rawSalesData = await this.prismaService.$queryRaw<
        { option_id: string; total_sold: number }[]
      >`
        SELECT 
          v.option_id, 
          SUM(od.quantity)::int as total_sold
        FROM order_details od
        JOIN orders o ON od.order_id = o.order_id
        JOIN product_variants v ON od.variant_id = v.variant_id
        WHERE o.status = ${EOrderStatus.DELIVERED}
          AND o.created_at >= NOW() - INTERVAL '3 months'
        GROUP BY v.option_id
      `;

      if (rawSalesData.length === 0) {
        this.logger.log('No sales data found to update best sellers.');
        return;
      }

      const updates = rawSalesData.map((item) => ({
        optionId: item.option_id,
        totalSold: item.total_sold,
      }));

      await this.productRepository.updateBestSellers(updates);

      this.logger.log(
        `Best seller update job completed. Updated ${updates.length} records.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to update best sellers: ${error.message}`,
        error.stack,
      );
    }
  }
}
