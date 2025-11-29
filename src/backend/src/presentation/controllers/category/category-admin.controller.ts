import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  baseCategoryResponseSchema,
} from '@/application/category/dtos';
import { BaseCategoryController } from './base-category.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  Permissions,
  ZodBody,
  ZodQuery,
} from '@/presentation/guards/decorators';
import { createPaginationCursorResponseSchema, errorResponseSchema, paginationCursorQuerySchema, statusResponseSchema } from '@/shared/dtos';
import { CategoryService } from '@/application/category/services';
import { type GetListCategoryDto } from '@/application/category/dtos/get-list-category.dto';

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
    schema: createPaginationCursorResponseSchema(baseCategoryResponseSchema),
    description: 'Categories retrieved successfully',
  })
  @ApiOperation({
    summary: 'Get all categories with filtering and pagination',
  })
  @ApiZodQuery(paginationCursorQuerySchema)
  @Get()
  getAllCategories(
    @ZodQuery(paginationCursorQuerySchema) query: GetListCategoryDto,
  ) {
    return this.categoryService.getListCategory(query);
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
