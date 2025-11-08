import { Controller } from "@nestjs/common";
import { CategoryService } from "../services";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { BaseCategoryController } from "./base-category.controller";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";
import { Permissions } from "../../shared/decorators";

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.CATEGORY}`)
@ApiBearerAuth()
@ApiSecurity("x-api-key")
@Permissions(EPermission.CATEGORY_MANAGEMENT)
@Controller("client/category")
export class CategoryClientController extends BaseCategoryController {
  constructor(
    protected readonly categoryService: CategoryService
  ) {
    super(categoryService);
  }
}