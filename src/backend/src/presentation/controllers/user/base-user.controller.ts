import { Get, Patch } from '@nestjs/common';
import { UserService } from '@/application/user/services/user.service';
import {
  updateUserProfileSchema,
  type UpdateUserProfileDto,
  userResponseSchema,
} from '@/application/user/dtos';
import {
  ApiZodBody,
  ApiZodResponse,
  CurrentUser,
  ZodBody,
} from '@/presentation/guards/decorators';
import type { UserInterface } from '@/shared/interfaces';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

export abstract class BaseUserController {
  constructor(protected readonly userService: UserService) { }

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
    description: 'User profile updated successfully',
  })
  @ApiOperation({ summary: 'Update user profile' })
  @ApiZodBody(updateUserProfileSchema)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: UserInterface,
    @ZodBody(updateUserProfileSchema) updateData: UpdateUserProfileDto,
  ) {
    console.log('Update Data:', updateData);
    return this.userService.updateProfile(user.id, updateData);
  }
}
