import { Controller, Post } from '@nestjs/common';
import { AuthService } from '@/application/auth/services/auth.service';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodResponse,
  Public,
  ZodBody,
} from '@/shared/decorators';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BaseAuthController } from './base-auth.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  type SignUpGuestDto,
  signUpGuestSchema,
} from '@/application/auth/dtos';
import { errorResponseSchema, statusResponseSchema } from '@/shared/dtos';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.AUTH}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/auth')
export class AuthClientController extends BaseAuthController {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'User registered successfully',
  })
  @ApiZodBody(signUpGuestSchema)
  @Public()
  @Post('sign-up')
  signUp(@ZodBody(signUpGuestSchema) body: SignUpGuestDto) {
    return this.authService.signUpGuest(body);
  }
}
