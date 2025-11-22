import { Controller, Delete, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  createCategorySchema,
  type CreateCategoryDto,
  type UpdateCategoryDto,
  updateCategorySchema,
  categoryResponseSchema,
} from '@/application/category/dtos';
import { BaseCategoryController } from './base-category.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodResponse,
  Permissions,
  ZodBody,
} from '@/shared/decorators';
import { errorResponseSchema, statusResponseSchema } from '@/shared/dtos';
import { CategoryService } from '@/application/category/services';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.CATEGORY}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.CATEGORY_MANAGEMENT)
@Controller('admin/category')
export class CategoryAdminController extends BaseCategoryController {
  constructor(protected readonly categoryService: CategoryService) {
    super(categoryService);
  }
  @ApiZodResponse({
    status: 201,
    schema: categoryResponseSchema,
    description: 'Category created successfully',
  })
  @ApiOperation({ summary: 'Create a new category' })
  @ApiZodBody(createCategorySchema)
  @Post()
  createCategory(
    @ZodBody(createCategorySchema) createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiZodResponse({
    status: 200,
    schema: categoryResponseSchema,
    description: 'Category updated successfully',
  })
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiZodBody(updateCategorySchema)
  @Post(':id')
  updateCategory(
    @Param('id') id: string,
    @ZodBody(updateCategorySchema) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Category deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a category by ID' })
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
