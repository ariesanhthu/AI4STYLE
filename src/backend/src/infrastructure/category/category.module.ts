import { Module } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import {
  CategoryService,
  CategoryValidationService,
} from '@/application/category/services';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@/core/category/interfaces';
import {
  CategoryAdminController,
  CategoryClientController,
} from '@/presentation/category/controllers';
import { InfrastructureModule } from '../infrastructure.module';
import { ILoggerService, LOGGER_SERVICE } from '@/shared/interfaces';
import { APP_FILTER } from '@nestjs/core';
import { CategoryExceptionFilter } from '../https/filters';

@Module({
  imports: [InfrastructureModule],
  controllers: [CategoryAdminController, CategoryClientController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: CategoryValidationService,
      useFactory: (
        categoryRepository: ICategoryRepository,
        logger: ILoggerService,
      ) => {
        return new CategoryValidationService(categoryRepository, logger);
      },
      inject: [CATEGORY_REPOSITORY, LOGGER_SERVICE],
    },
    {
      provide: CategoryService,
      useFactory: (
        categoryRepository: ICategoryRepository,
        validationService: CategoryValidationService,
        logger: ILoggerService,
      ) => {
        return new CategoryService(
          categoryRepository,
          validationService,
          logger,
        );
      },
      inject: [CATEGORY_REPOSITORY, CategoryValidationService, LOGGER_SERVICE],
    },
    {
      provide: APP_FILTER,
      useClass: CategoryExceptionFilter
    }
  ],
  exports: [CategoryService, CATEGORY_REPOSITORY],
})
export class CategoryModule { }
