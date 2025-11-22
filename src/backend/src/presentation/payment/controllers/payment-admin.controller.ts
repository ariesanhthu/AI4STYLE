import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  getListOfPaymentsQuerySchema,
  type GetListOfPaymentsQueryDto,
  paymentResponseSchema,
} from '@/application/payment/dtos';
import { BasePaymentController } from './base-payment.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  Permissions,
  Public,
  Webhook,
  ZodQuery,
} from '@/shared/decorators';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
  statusResponseSchema,
} from '@/shared/dtos';
import { PaymentService } from '@/application/payment/services';
import { type MomoIpn } from '@/infrastructure/payment/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.PAYMENT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.ORDER_MANAGEMENT)
@Controller('admin/payments')
export class PaymentAdminController extends BasePaymentController {
  constructor(protected readonly paymentService: PaymentService) {
    super(paymentService);
  }

  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(paymentResponseSchema),
    description: 'List of payments retrieved successfully',
  })
  @ApiOperation({
    summary: 'Get list of payments with filtering and pagination',
  })
  @ApiZodQuery(getListOfPaymentsQuerySchema)
  @Get()
  getListOfPayments(
    @ZodQuery(getListOfPaymentsQuerySchema) query: GetListOfPaymentsQueryDto,
  ) {
    return this.paymentService.getListOfPayments(query);
  }

  @ApiZodResponse({
    status: 200,
    schema: paymentResponseSchema,
    description: 'Payment captured successfully',
  })
  @ApiOperation({ summary: 'Capture a payment' })
  @Post(':id/capture')
  capturePayment(@Param('id') id: string) {
    return this.paymentService.capturePayment(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Payment canceled successfully',
  })
  @ApiOperation({ summary: 'Cancel a payment' })
  @Post(':id/cancel')
  cancelPayment(@Param('id') id: string) {
    return this.paymentService.cancelPayment(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'Payment canceled successfully',
  })
  @ApiOperation({ summary: 'Cancel a payment' })
  @Post(':id/refund')
  refundPayment(@Param('id') id: string) {
    return this.paymentService.refundPayment(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: statusResponseSchema,
    description: 'MoMo IPN handled successfully',
  })
  @ApiOperation({ summary: 'Handle MoMo IPN webhook' })
  @Webhook()
  @Public()
  @Post('momo/ipn')
  handleMoMoIPN(@Body() payload: MomoIpn) {
    return this.paymentService.handleProviderWebhook(
      EPaymentMethod.MOMO,
      payload,
    );
  }
}
