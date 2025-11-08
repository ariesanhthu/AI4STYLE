import { Body, Controller, Param, Post, UsePipes } from "@nestjs/common";
import { CategoryService } from "../services";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { createCategorySchema, type CreateCategoryDto, type UpdateCategoryDto, updateCategorySchema } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import z from "zod";
import { BaseCategoryController } from "./base-category.controller";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";
import { Permissions } from "../../shared/decorators";

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
  @ApiBody({ schema: z.toJSONSchema(createCategorySchema) as SchemaObject })
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: "Update a category by ID" })
  @ApiBody({ schema: z.toJSONSchema(updateCategorySchema) as SchemaObject })
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  @Post(":id")
  updateCategory(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @ApiOperation({ summary: "Delete a category by ID" })
  @Post(":id")
  deleteCategory(@Param("id") id: string) {
    return this.categoryService.deleteCategory(id);
  }
}