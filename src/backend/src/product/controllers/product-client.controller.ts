import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { BaseProductController } from './base-product.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '../../shared/enums';
import { ApiZodQuery, Public } from '../../shared/decorators';
import { ZodValidationPipe } from '../../shared/pipes';
import { getListProductClientSchema } from '../dtos';
import type { GetListProductClientDto } from '../dtos';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.PRODUCT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller('client/products')
export class ProductClientController extends BaseProductController {
  constructor(protected readonly productService: ProductService) {
    super(productService);
  }

  @ApiOperation({ summary: 'Get all product options with filtering and pagination' })
  @ApiZodQuery(getListProductClientSchema)
  @Public()
  @Get('options')
  @UsePipes(new ZodValidationPipe(getListProductClientSchema))
  getAllProductOptions(@Query() query: GetListProductClientDto) {
    // Fetch database
    // Process ...
    // return client
    return this.productService.getAllProductOptions(query);
  }

  @ApiOperation({ summary: 'Get product option by ID' })
  @Public()
  @Get('options/:id')
  getProductOptionById(@Param('id') id: string) {
    return this.productService.getProductOptionById(id);
  }
}
