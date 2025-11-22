import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import {
  ProductAdminController,
  ProductClientController,
} from '@/presentation/product/controllers';
import { PRODUCT_REPOSITORY } from '@/core/product/interfaces/product.repository.interface';
import { ProductService } from '@/application/product/services';

@Module({
  controllers: [ProductAdminController, ProductClientController],
  providers: [
    ProductService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService, PRODUCT_REPOSITORY],
})
export class ProductModule {}
