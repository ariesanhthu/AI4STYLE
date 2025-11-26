import { Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiZodResponse } from '@/presentation/guards/decorators';
import { paymentResponseSchema } from '@/application/payment/dtos';
import { PaymentService } from '@/application/payment/services';

export abstract class BasePaymentController {
  constructor(protected readonly paymentService: PaymentService) { }

  @ApiZodResponse({
    status: 200,
    schema: paymentResponseSchema,
    description: 'Payment retrieved successfully',
  })
  @ApiOperation({ summary: 'Get payment by ID' })
  @Get(':id')
  getPaymentById(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }
}
