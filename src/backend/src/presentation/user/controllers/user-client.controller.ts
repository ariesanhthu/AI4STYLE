import { Controller } from '@nestjs/common';
import { UserService } from '@/application/user/services/user.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BaseUserController } from './base-user.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import { errorResponseSchema } from '@/shared/dtos';
import { ApiZodErrorResponse } from '@/shared/decorators';

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.USER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('client/users')
export class UserClientController extends BaseUserController {
  constructor(protected readonly userService: UserService) {
    super(userService);
  }
}
