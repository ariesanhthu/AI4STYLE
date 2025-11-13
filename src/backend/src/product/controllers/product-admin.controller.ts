import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { BaseProductController } from './base-product.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '../../shared/enums';
import { ApiZodQuery, Permissions } from '../../shared/decorators';
import { ZodValidationPipe } from '../../shared/pipes';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import z from 'zod';
import {
  createProductSchema,
  updateProductSchema,
  getListProductSchema,
  updateProductStockPriceSchema,
} from '../dtos';
import type {
  CreateProductDto,
  UpdateProductDto,
  GetListProductDto,
  UpdateProductStockPriceDto,
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

  @ApiOperation({ summary: 'Get all products with filtering and pagination' })
  @ApiZodQuery(getListProductSchema)
  @Get()
  @UsePipes(new ZodValidationPipe(getListProductSchema))
  getAllProducts(@Query() query: GetListProductDto) {
    return this.productService.getAllProducts(query);
  }

  @ApiOperation({ summary: 'Create a new product with options and variants' })
  @ApiBody({ schema: z.toJSONSchema(createProductSchema) as SchemaObject })
  @Post()
  @UsePipes(new ZodValidationPipe(createProductSchema))
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'Update product general information' })
  @ApiBody({ schema: z.toJSONSchema(updateProductSchema) as SchemaObject })
  @Patch(':id')
  updateProduct(
    @Param('id') id: string, 
    @Body(new ZodValidationPipe(updateProductSchema)) updateProductDto: UpdateProductDto) 
  {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Update product variants stock and price in bulk' })
  @ApiBody({ schema: z.toJSONSchema(updateProductStockPriceSchema) as SchemaObject })
  @Patch(':id/inventory')
  updateProductStockPrice(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProductStockPriceSchema)) updateStockPriceDto: UpdateProductStockPriceDto,
  ) {
    return this.productService.updateProductStockPrice(id, updateStockPriceDto);
  }

  @ApiOperation({ summary: 'Delete a product by ID' })
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
