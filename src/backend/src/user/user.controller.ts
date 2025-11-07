import { Body, Controller, Get, Patch, Query, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { getListUserSchema, updateUserProfileSchema, type GetListUserDto, type UpdateUserProfileDto } from "./dtos";
import { ZodValidationPipe } from "../shared/pipes";
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodQuery, CurrentUser } from "../shared/decorators";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import z from "zod";
import type { UserInterface } from "../shared/interfaces";

@ApiTags('User')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get("profile")
  async getProfile(
    @CurrentUser() user: UserInterface
  ) {
    return this.userService.getUserProfile(user.id);
  }

  @ApiZodQuery(getListUserSchema)
  @UsePipes(new ZodValidationPipe(getListUserSchema))
  @Get()
  async getList(@Query() query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
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