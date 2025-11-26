import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  createPaymentSchema,
  type CreatePaymentDto,
  paymentResponseSchema,
} from '@/application/payment/dtos';
import { BasePaymentController } from './base-payment.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodResponse,
  ZodBody,
} from '@/presentation/guards/decorators';
import { errorResponseSchema } from '@/shared/dtos';
import { PaymentService } from '@/application/payment/services';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.PAYMENT}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/payments')
export class PaymentClientController extends BasePaymentController {
  constructor(protected readonly paymentService: PaymentService) {
    super(paymentService);
  }

  @ApiZodResponse({
    status: 201,
    schema: paymentResponseSchema,
    description: 'Payment created successfully',
  })
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiZodBody(createPaymentSchema)
  @Post()
  createPayment(@ZodBody(createPaymentSchema) body: CreatePaymentDto) {
    return this.paymentService.createPayment(body);
  }
}
