import { Get, Param } from '@nestjs/common';
import { OrderService } from '@/application/order/services';
import { ApiOperation } from '@nestjs/swagger';
import { ApiZodResponse } from '@/presentation/guards/decorators';
import { orderResponseDetailDtoSchema } from '@/application/order/dtos';

export abstract class BaseOrderController {
  constructor(protected readonly orderService: OrderService) { }

  @ApiZodResponse({
    status: 200,
    schema: orderResponseDetailDtoSchema,
    description: 'Order retrieved successfully',
  })
  @ApiOperation({ summary: 'Get order by ID' })
  @Get(':id')
  getOrderById(@Param('id') id: string) {
    return this.orderService.getById(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: orderResponseDetailDtoSchema,
    description: 'Order retrieved successfully',
  })
  @ApiOperation({ summary: 'Get order by code' })
  @Get('code/:code')
  getOrderByCode(@Param('code') code: string) {
    return this.orderService.getByCode(code);
  }
}
