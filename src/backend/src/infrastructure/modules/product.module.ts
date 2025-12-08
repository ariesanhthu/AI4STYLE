import { Module } from '@nestjs/common';
import {
  ProductAdminController,
  ProductClientController,
} from '@/presentation/controllers/product';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from '@/core/product/interfaces/product.repository.interface';
import { ProductService } from '@/application/product/services';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { ProductExceptionFilter } from '../https/filters';
import { IUnitOfWork, UNIT_OF_WORK } from '@/application/shared';

@Module({
  imports: [InfrastructureModule],
  controllers: [ProductAdminController, ProductClientController],
  providers: [
    {
      provide: ProductService,
      useFactory: (
        productRepository: IProductRepository,
        logger: ILoggerService,
        uow: IUnitOfWork,
      ) => {
        return new ProductService(productRepository, logger, uow);
      },
      inject: [PRODUCT_REPOSITORY, LOGGER_SERVICE, UNIT_OF_WORK],
    },
    {
      provide: APP_FILTER,
      useClass: ProductExceptionFilter
    }
  ],
  exports: [ProductService],
})
export class ProductModule { }
