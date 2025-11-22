import { Module } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import {
  CategoryService,
  CategoryValidationService,
} from '@/application/category/services';
import { CATEGORY_REPOSITORY } from '@/core/category/interfaces';
import {
  CategoryAdminController,
  CategoryClientController,
} from '@/presentation/category/controllers';

@Module({
  controllers: [CategoryAdminController, CategoryClientController],
  providers: [
    CategoryService,
    CategoryValidationService,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
  ],
  exports: [CategoryService, CATEGORY_REPOSITORY],
})
export class CategoryModule {}
