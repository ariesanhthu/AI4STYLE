import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from '@/application/user/services/user.service';
import {
  getListUserSchema,
  userResponseSchema,
  type GetListUserDto,
  type UpdateUserDto, 
  updateUserSchema 
} from '@/application/user/dtos';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiZodBody,
  ApiZodErrorResponse,
  ApiZodQuery,
  ApiZodResponse,
  CurrentUser,
  Permissions,
  ZodBody,
  ZodQuery,
} from '@/presentation/guards/decorators';
import { BaseUserController } from './base-user.controller';
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from '@/shared/enums';
import {
  createPaginationCursorResponseSchema,
  errorResponseSchema,
} from '@/shared/dtos';
import { type UserInterface } from '@/shared/interfaces';

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
  @Permissions(EPermission.USER_MANAGEMENT)
  @Get()
  async getList(@ZodQuery(getListUserSchema) query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
  }

  @ApiZodResponse({
    status: 200,
    schema: userResponseSchema,
    description: 'User profile retrieved successfully',
  })
  @ApiOperation({ summary: 'Get user profile' })
  @Get('profile')
  async getProfile(@CurrentUser() user: UserInterface) {
    return this.userService.getUserProfile(user.id);
  }

  @ApiZodResponse({
    status: 200,
    schema: userResponseSchema,
    description: 'User retrieved successfully',
  })
  @ApiOperation({ summary: 'Get user profile by id' })
  @Permissions(EPermission.USER_MANAGEMENT)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @ApiZodResponse({
    status: 200,
    schema: userResponseSchema,
    description: 'User updated successfully',
  })
  @ApiOperation({ summary: 'Update user profile by id' })
  @ApiZodBody(updateUserSchema)
  @Patch(':id')
  async updateById(@Param('id') id: string, @ZodBody(updateUserSchema) body: UpdateUserDto) {
    return this.userService.updateProfile(id, body);
  }
}
