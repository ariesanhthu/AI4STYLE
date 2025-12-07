import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from '@/application/order/services';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  createOrderSchema,
  type CreateOrderDto,
  orderResponseSchema,
  getListOfOrdersQuerySchema,
  type GetListOfOrdersQueryDto,
} from '@/application/order/dtos';
import { BaseOrderController } from './base-order.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  CurrentUser,
  ZodBody,
  ZodQuery,
} from '@/presentation/guards/decorators';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
} from '@/shared/dtos';
import type { UserInterface } from '@/shared/interfaces';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.ORDER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/orders')
export class OrderClientController extends BaseOrderController {
  constructor(protected readonly orderService: OrderService) {
    super(orderService);
  }

  @ApiZodResponse({
    status: 201,
    schema: orderResponseSchema,
    description: 'Order created successfully',
  })
  @ApiOperation({ summary: 'Create a new order' })
  @ApiZodBody(createOrderSchema)
  @Post()
  createOrder(
    @ZodBody(createOrderSchema) body: CreateOrderDto,
    @CurrentUser() user: UserInterface,
  ) {
    return this.orderService.createOrder(user.id, body);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(orderResponseSchema),
    description: 'List of user orders retrieved successfully',
  })
  @ApiOperation({ summary: 'Get list of current user orders' })
  @ApiZodQuery(getListOfOrdersQuerySchema)
  @Get('my-orders')
  getMyOrders(
    @ZodQuery(getListOfOrdersQuerySchema) query: GetListOfOrdersQueryDto,
    @CurrentUser() user: UserInterface,
  ) {
    // Force filter by current user
    query.customerId = user.id;
    return this.orderService.getListOfOrders(query);
  }
}
