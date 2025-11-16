import { Get, Param } from "@nestjs/common";
import { CategoryService } from "../services";
import { ApiOperation } from "@nestjs/swagger";
import { ApiZodResponse, Public } from "../../shared/decorators";
import { categoryResponseSchema, categoryTreeResponseSchema } from "../dtos";

export abstract class BaseCategoryController {
  constructor(
    protected readonly categoryService: CategoryService
  ) {}

  @ApiZodResponse({ status: 200, schema: categoryResponseSchema, description: "Category retrieved successfully" })
  @ApiOperation({ summary: "Get category by ID" })
  @Public()
  @Get(":id")
  getCategoryById(@Param("id") id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiZodResponse({ status: 200, schema: categoryTreeResponseSchema, description: "Category tree retrieved successfully" })
  @ApiOperation({ summary: "Get all categories" })
  @Public()
  @Get()
  getAllCategories() {
    return this.categoryService.getCategoryTree();
  }

  @ApiZodResponse({ status: 200, schema: categoryResponseSchema, description: "Category retrieved successfully" })
  @ApiOperation({ summary: "Get category by slug" })
  @Public()
  @Get("slug/:slug")
  getCategoriesBySlug(@Param("slug") slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }
}