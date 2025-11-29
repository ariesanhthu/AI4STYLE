import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '@/application/product/services/product.service';
import { BaseProductController } from './base-product.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  Public,
  ZodQuery,
} from '@/presentation/guards/decorators';
import {
  getListProductClientSchema,
  productOptionResponseSchema,
  getBestSellerSchema,
  productOptionBestSellerSchema,
} from '@/application/product/dtos';
import type { GetListProductClientDto, GetBestSellerDto } from '@/application/product/dtos';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
} from '@/shared/dtos';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.PRODUCT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/products')
export class ProductClientController extends BaseProductController {
  constructor(protected readonly productService: ProductService) {
    super(productService);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(productOptionResponseSchema),
    description: 'Product options retrieved successfully',
  })
  @ApiOperation({
    summary: 'Get all product options with filtering and pagination',
  })
  @ApiZodQuery(getListProductClientSchema)
  @Public()
  @Get('options')
  getAllProductOptions(
    @ZodQuery(getListProductClientSchema) query: GetListProductClientDto,
  ) {
    return this.productService.getAllProductOptions(query);
  }

  @ApiZodResponse({
    status: 200,
    schema: productOptionResponseSchema,
    description: 'Product option retrieved successfully',
  })
  @ApiOperation({ summary: 'Get product option by ID' })
  @Public()
  @Get('options/:id')
  getProductOptionById(@Param('id') id: string) {
    return this.productService.getProductOptionById(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(productOptionBestSellerSchema),
    description: 'Best seller products retrieved successfully',
  })
  @ApiOperation({ summary: 'Get best seller products' })
  @ApiZodQuery(getBestSellerSchema)
  @Public()
  @Get('best-sellers')
  getBestSellers(
    @ZodQuery(getBestSellerSchema) query: GetBestSellerDto,
  ) {
    return this.productService.getBestSellers(query);
  }
}
