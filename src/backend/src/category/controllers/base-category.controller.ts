import { Get, Param } from "@nestjs/common";
import { CategoryService } from "../services";
import { ApiOperation } from "@nestjs/swagger";
import { Public } from "../../shared/decorators";

export abstract class BaseCategoryController {
  constructor(
    protected readonly categoryService: CategoryService
  ) {}

  @ApiOperation({ summary: "Get category by ID" })
  @Public()
  @Get(":id")
  getCategoryById(@Param("id") id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ summary: "Get all categories" })
  @Public()
  @Get()
  getAllCategories() {
    return this.categoryService.getCategoryTree();
  }

  @ApiOperation({ summary: "Get category by slug" })
  @Public()
  @Get("slug/:slug")
  getCategoriesBySlug(@Param("slug") slug: string) {
    return this.categoryService.getCategoryBySlug(slug);
  }
}