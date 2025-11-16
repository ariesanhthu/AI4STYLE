import { Get, Param, Query, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductService } from '../product.service';
import { ApiZodQuery, Public } from '../../shared/decorators';
import { ZodValidationPipe } from '../../shared/pipes';
import { getProductByIdQuerySchema } from '../dtos';
import type { GetProductByIdQueryDto } from '../dtos';

export abstract class BaseProductController {
  constructor(protected readonly productService: ProductService) {}
}
