import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { BaseProductController } from './base-product.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '../../shared/enums';
import { ApiZodBody, ApiZodQuery, Permissions, Public, ZodBody, ZodQuery } from '../../shared/decorators';
import {
  createProductSchema,
  updateProductSchema,
  getListProductSchema,
  updateProductStockPriceSchema,
  getProductByIdQuerySchema,
} from '../dtos';
import type {
  CreateProductDto,
  UpdateProductDto,
  GetListProductDto,
  UpdateProductStockPriceDto,
  GetProductByIdQueryDto,
} from '../dtos';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.PRODUCT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Permissions(EPermission.PRODUCT_MANAGEMENT)
@Controller('admin/product')
export class ProductAdminController extends BaseProductController {
  constructor(protected readonly productService: ProductService) {
    super(productService);
  }

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

  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiZodQuery(getListProductSchema)
  @Get()
  getAllProducts(@ZodQuery(getListProductSchema) query: GetListProductDto) {
    return this.productService.getAllProducts(query);
  }

  @ApiOperation({ summary: 'Create a new product with options and variants' })
  @ApiZodBody(createProductSchema)
  @Post()
  createProduct(@ZodBody(createProductSchema) createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Update product general information' })
  @ApiZodBody(updateProductSchema)
  @Patch(':id')
  updateProduct(
    @Param('id') id: string, 
    @ZodBody(updateProductSchema) updateProductDto: UpdateProductDto) 
  {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Update product variants stock and price in bulk' })
  @ApiZodBody(updateProductStockPriceSchema)
  @Patch(':id/inventory')
  updateProductStockPrice(
    @Param('id') id: string,
    @ZodBody(updateProductStockPriceSchema) updateStockPriceDto: UpdateProductStockPriceDto,
  ) {
    return this.productService.updateProductStockPrice(id, updateStockPriceDto);
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
