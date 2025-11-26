import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BaseAuthController } from './base-auth.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import { errorResponseSchema, statusResponseSchema } from '@/shared/dtos';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodResponse,
  ZodBody,
} from '@/presentation/guards/decorators';
import { AuthService } from '@/application/auth/services';
import {
  type SignUpStaffDto,
  signUpStaffSchema,
} from '@/application/auth/dtos';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.AUTH}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('admin/auth')
export class AuthAdminController extends BaseAuthController {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'Staff registered successfully',
  })
  @ApiZodBody(signUpStaffSchema)
  @Post('sign-up')
  signUp(@ZodBody(signUpStaffSchema) body: SignUpStaffDto) {
    return this.authService.signUpStaff(body);
  }
}
