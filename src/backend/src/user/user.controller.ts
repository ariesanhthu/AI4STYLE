import { Body, Controller, Get, Param, Patch, Query, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { getListUserSchema, updateUserProfileSchema, type GetListUserDto, type UpdateUserProfileDto } from "./dtos";
import { ZodValidationPipe } from "../shared/pipes";
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodQuery, CurrentUser, Roles } from "../shared/decorators";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import z from "zod";
import type { JwtPayload } from "../shared/interfaces";
import { ERole } from "../shared/enums";

@ApiTags('User')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get("profile")
  async getProfile(
    @CurrentUser() user: JwtPayload
  ) {
    return this.userService.getUserProfile(user.sub);
  }

  @ApiZodQuery(getListUserSchema)
  @Roles(ERole.ADMIN)
  @UsePipes(new ZodValidationPipe(getListUserSchema))
  @Get()
  async getList(@Query() query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
  }

  @ApiBody({ schema: z.toJSONSchema(updateUserProfileSchema) as SchemaObject })
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body(new ZodValidationPipe(updateUserProfileSchema)) updateData: UpdateUserProfileDto
  ) {
    console.log('Update Data:', updateData);
    return this.userService.updateProfile(user.sub, updateData);
  }
}