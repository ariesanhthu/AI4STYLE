import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UNIT_OF_WORK } from '@/application/shared';
import { PrismaUnitOfWork } from './unit-of-work/prisma-unit-of-work';
import { CATEGORY_REPOSITORY } from '@/core/category/interfaces';
import { PrismaCategoryRepository, PrismaImageRepository, PrismaOrderRepository, PrismaPaymentMethodRepository, PrismaPaymentRepository, PrismaProductRepository, PrismaRoleRepository, PrismaUserRepository } from './repositories';
import { ORDER_REPOSITORY } from '@/core/order/interfaces';
import { PRODUCT_REPOSITORY } from '@/core/product/interfaces';
import { PAYMENT_REPOSITORY } from '@/core/payment/interfaces';
import { PAYMENT_METHOD_REPOSITORY } from '@/core/payment-method/interfaces';
import { USER_REPOSITORY } from '@/core/user/interfaces';
import { ROLE_REPOSITORY } from '@/core/role/interfaces';
import { IMAGE_REPOSITORY } from '@/core/upload/interfaces';

// @Global() // Makes PrismaService available everywhere
@Module({
  providers: [
    PrismaService, 
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: PAYMENT_METHOD_REPOSITORY,
      useClass: PrismaPaymentMethodRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: IMAGE_REPOSITORY,
      useClass: PrismaImageRepository,
    },    
    {
      provide: UNIT_OF_WORK,
      useClass: PrismaUnitOfWork,
    }
  ],
  exports: [
    PrismaService,
    UNIT_OF_WORK,
    CATEGORY_REPOSITORY,
    ORDER_REPOSITORY,
    PRODUCT_REPOSITORY,
    PAYMENT_REPOSITORY,
    PAYMENT_METHOD_REPOSITORY,
    USER_REPOSITORY,
    ROLE_REPOSITORY,
    IMAGE_REPOSITORY,
  ],
})
export class PrismaModule {}
