import { Get, Patch } from "@nestjs/common";
import { UserService } from "../user.service";
import { updateUserProfileSchema, type UpdateUserProfileDto } from "../dtos";
import { ApiZodBody, CurrentUser, ZodBody } from "../../shared/decorators";
import type { UserInterface } from "../../shared/interfaces";
import { ApiOperation } from "@nestjs/swagger/dist/decorators/api-operation.decorator";

export abstract class BaseUserController {
  constructor(
    protected readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: "Get user profile" })
  @Get("profile")
  async getProfile(
    @CurrentUser() user: UserInterface
  ) {
    return this.userService.getUserProfile(user.id);
  }

  @ApiOperation({ summary: "Update user profile" })
  @ApiZodBody(updateUserProfileSchema)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: UserInterface,
    @ZodBody(updateUserProfileSchema) updateData: UpdateUserProfileDto
  ) {
    console.log('Update Data:', updateData);
    return this.userService.updateProfile(user.id, updateData);
  }
}