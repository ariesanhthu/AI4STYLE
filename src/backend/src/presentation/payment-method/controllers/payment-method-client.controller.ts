import { Controller, Get } from '@nestjs/common';
import { PaymentMethodService } from '@/application/payment-method/services';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { paymentMethodResponseSchema } from '@/application/payment-method/dtos';
import {
  ApiZodErrorResponse,
  ApiZodResponse,
  Public,
} from '@/shared/decorators';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import { errorResponseSchema } from '@/shared/dtos';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.PAYMENT_METHOD}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/payment-methods')
export class PaymentMethodClientController {
  constructor(protected readonly paymentMethodService: PaymentMethodService) {}

  @ApiZodResponse({
    status: 200,
    schema: paymentMethodResponseSchema.array(),
    description: 'Payment methods retrieved successfully',
  })
  @ApiOperation({ summary: 'Get all available payment methods' })
  @Public()
  @Get()
  getAllPaymentMethods() {
    return this.paymentMethodService.getAllPaymentMethods();
  }
}
