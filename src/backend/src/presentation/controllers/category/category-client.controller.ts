import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BaseCategoryController } from './base-category.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import { ApiZodErrorResponse, Permissions } from '@/presentation/guards/decorators';
import { errorResponseSchema } from '@/shared/dtos';
import { CategoryService } from '@/application/category/services';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.CATEGORY}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.CATEGORY_MANAGEMENT)
@Controller('client/category')
export class CategoryClientController extends BaseCategoryController {
  constructor(protected readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
