import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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
  updateOrderStatusSchema,
  type UpdateOrderStatusDto,
} from '@/application/order/dtos';
import { BaseOrderController } from './base-order.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  CurrentUser,
  Permissions,
  ZodBody,
  ZodQuery,
} from '@/shared/decorators';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
  statusResponseSchema,
} from '@/shared/dtos';
import type { JwtPayload } from '@/shared/interfaces';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.ORDER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.ORDER_MANAGEMENT)
@Controller('admin/orders')
export class OrderAdminController extends BaseOrderController {
  constructor(protected readonly orderService: OrderService) {
    super(orderService);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(orderResponseSchema),
    description: 'List of orders retrieved successfully',
  })
  @ApiOperation({ summary: 'Get list of orders with filtering and pagination' })
  @ApiZodQuery(getListOfOrdersQuerySchema)
  @Get()
  getListOfOrders(
    @ZodQuery(getListOfOrdersQuerySchema) query: GetListOfOrdersQueryDto,
  ) {
    return this.orderService.getListOfOrders(query);
  }

  @ApiZodResponse({
    status: 200,
    schema: orderResponseSchema,
    description: 'Order status updated successfully',
  })
  @ApiOperation({ summary: 'Update order status' })
  @ApiZodBody(updateOrderStatusSchema)
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @ZodBody(updateOrderStatusSchema) body: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(id, body);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Order deleted successfully',
  })
  @ApiOperation({ summary: 'Delete an order (only CANCELED orders)' })
  @Delete(':id')
  deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }
}
