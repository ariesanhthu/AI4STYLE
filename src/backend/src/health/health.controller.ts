import { Controller, Get } from '@nestjs/common';
import { Public } from '../shared/decorators';
import { ApiSecurity } from '@nestjs/swagger';

@Public()
@ApiSecurity('x-api-key')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      success: true,
      message: "Test endpoint reached"
    }
  }
}