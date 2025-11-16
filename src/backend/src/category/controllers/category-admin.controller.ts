import { Controller, Delete, Param, Post } from "@nestjs/common";
import { CategoryService } from "../services";
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { createCategorySchema, type CreateCategoryDto, type UpdateCategoryDto, updateCategorySchema } from "../dtos";
import { BaseCategoryController } from "./base-category.controller";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";
import { ApiZodBody, Permissions, ZodBody } from "../../shared/decorators";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.CATEGORY}`)
@ApiBearerAuth()
@ApiSecurity("x-api-key")
@Permissions(EPermission.CATEGORY_MANAGEMENT)
@Controller("admin/category")
export class CategoryAdminController extends BaseCategoryController {
  constructor(
    protected readonly categoryService: CategoryService
  ) {
    super(categoryService);
  }
  @ApiOperation({ summary: "Create a new category" })
  @ApiZodBody(createCategorySchema)
  @Post()
  createCategory(@ZodBody(createCategorySchema) createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: "Update a category by ID" })
  @ApiZodBody(updateCategorySchema)
  @Post(":id")
  updateCategory(@Param("id") id: string, @ZodBody(updateCategorySchema) updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: "Delete a category by ID" })
  @Delete(":id")
  deleteCategory(@Param("id") id: string) {
    return this.categoryService.deleteCategory(id);
  }
}