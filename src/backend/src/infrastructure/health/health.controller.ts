import { Controller, Get } from '@nestjs/common';
import { ApiZodErrorResponse, Public } from '@/shared/decorators';
import { ApiSecurity } from '@nestjs/swagger';
import { errorResponseSchema } from '@/shared/dtos';

@Public()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      success: true,
      message: 'Test endpoint reached',
    };
  }
}
