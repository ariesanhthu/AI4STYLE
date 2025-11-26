import { Controller, Get } from '@nestjs/common';
import { UserService } from '@/application/user/services/user.service';
import {
  getListUserSchema,
  userResponseSchema,
  type GetListUserDto,
} from '@/application/user/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  ZodQuery,
} from '@/presentation/guards/decorators';
import { BaseUserController } from './base-user.controller';
import { ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
} from '@/shared/dtos';

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.USER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Controller('admin/users')
export class UserAdminController extends BaseUserController {
  constructor(protected readonly userService: UserService) {
    super(userService);
  }
  @ApiZodResponse({
    status: 200,
    schema: createPaginationCursorResponseSchema(userResponseSchema),
    description: 'List of users retrieved successfully',
  })
  @ApiOperation({ summary: 'Get list of users with filtering and pagination' })
  @ApiZodQuery(getListUserSchema)
  @Get()
  async getList(@ZodQuery(getListUserSchema) query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
  }
}
