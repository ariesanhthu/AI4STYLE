import { Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiZodResponse, Public } from '@/presentation/guards/decorators';
import {
  categoryResponseSchema,
  categoryTreeResponseSchema,
} from '@/application/category/dtos';
import { CategoryService } from '@/application/category/services';

export abstract class BaseCategoryController {
  constructor(protected readonly categoryService: CategoryService) { }

  @ApiZodResponse({
    status: 200,
    schema: categoryResponseSchema,
    description: 'Category retrieved successfully',
  })
  @ApiOperation({ summary: 'Get category by ID' })
  @Public()
  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: categoryTreeResponseSchema,
    description: 'Category tree retrieved successfully',
  })
  @ApiOperation({ summary: 'Get all categories' })
  @Public()
  @Get('tree')
  getAllCategoriesInTreeFormat() {
    return this.categoryService.getCategoryTree();
  }

  @ApiZodResponse({
    status: 200,
    schema: categoryResponseSchema,
    description: 'Category retrieved successfully',
  })
  @ApiOperation({ summary: 'Get category by slug' })
  @Public()
  @Get('slug/:slug')
  getCategoriesBySlug(@Param('slug') slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }
}
