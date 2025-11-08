import { Body, Get, Patch } from "@nestjs/common";
import { UserService } from "../user.service";
import { updateUserProfileSchema, type UpdateUserProfileDto } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { ApiBody } from "@nestjs/swagger";
import { CurrentUser } from "../../shared/decorators";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import z from "zod";
import type { UserInterface } from "../../shared/interfaces";

export abstract class BaseUserController {
  constructor(
    protected readonly userService: UserService,
  ) {}

  @Get("profile")
  async getProfile(
    @CurrentUser() user: UserInterface
  ) {
    return this.userService.getUserProfile(user.id);
  }

  @ApiBody({ schema: z.toJSONSchema(updateUserProfileSchema) as SchemaObject })
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: UserInterface,
    @Body(new ZodValidationPipe(updateUserProfileSchema)) updateData: UpdateUserProfileDto
  ) {
    console.log('Update Data:', updateData);
    return this.userService.updateProfile(user.id, updateData);
  }
}