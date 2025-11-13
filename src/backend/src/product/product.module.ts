import { Module } from '@nestjs/common';
import { ProductAdminController, ProductClientController } from './controllers';
import { ProductService } from './product.service';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [ProductAdminController, ProductClientController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService, 'ProductRepository'],
})
export class ProductModule {}
