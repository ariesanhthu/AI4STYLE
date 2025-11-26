import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '@/application/product/services/product.service';
import { BaseProductController } from './base-product.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  Permissions,
  Public,
  ZodBody,
  ZodQuery,
} from '@/presentation/guards/decorators';
import {
  createProductSchema,
  updateProductSchema,
  getListProductSchema,
  updateProductStockPriceSchema,
  getProductByIdQuerySchema,
  productResponseSchema,
} from '@/application/product/dtos';
import type {
  CreateProductDto,
  UpdateProductDto,
  GetListProductDto,
  UpdateProductStockPriceDto,
  GetProductByIdQueryDto,
} from '@/application/product/dtos';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
  statusResponseSchema,
} from '@/shared/dtos';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.PRODUCT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.PRODUCT_MANAGEMENT)
@Controller('admin/product')
export class ProductAdminController extends BaseProductController {
  constructor(protected readonly productService: ProductService) {
    super(productService);
  }

  @ApiZodResponse({
    status: 200,
    schema: productResponseSchema,
    description: 'Product retrieved successfully',
  })
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiZodQuery(getProductByIdQuerySchema)
  @Public()
  @Get(':id')
  getProductById(
    @Param('id') id: string,
    @ZodQuery(getProductByIdQuerySchema) query: GetProductByIdQueryDto,
  ) {
    return this.productService.getProductById(id, query);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(productResponseSchema),
    description: 'Products retrieved successfully',
  })
  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiZodQuery(getListProductSchema)
  @Get()
  getAllProducts(@ZodQuery(getListProductSchema) query: GetListProductDto) {
    return this.productService.getAllProducts(query);
  }

  @ApiZodResponse({
    status: 201,
    schema: productResponseSchema,
    description: 'Product created successfully',
  })
  @ApiOperation({ summary: 'Create a new product with options and variants' })
  @ApiZodBody(createProductSchema)
  @Post()
  createProduct(
    @ZodBody(createProductSchema) createProductDto: CreateProductDto,
  ) {
    return this.productService.createProduct(createProductDto);
  }

  @ApiZodResponse({
    status: 200,
    schema: productResponseSchema,
    description: 'Product updated successfully',
  })
  @ApiOperation({ summary: 'Update product general information' })
  @ApiZodBody(updateProductSchema)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @ZodBody(updateProductSchema) updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Product inventory updated successfully',
  })
  @ApiOperation({ summary: 'Update product variants stock and price in bulk' })
  @ApiZodBody(updateProductStockPriceSchema)
  @Patch(':id/inventory')
  updateProductStockPrice(
    @Param('id') id: string,
    @ZodBody(updateProductStockPriceSchema)
    updateStockPriceDto: UpdateProductStockPriceDto,
  ) {
    return this.productService.updateProductStockPrice(id, updateStockPriceDto);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Product deleted successfully',
  })
  @ApiOperation({ summary: 'Delete a product by ID' })
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
