import { Body, Controller, Get, Param, Patch, Query, UsePipes } from "@nestjs/common";
import { UserService } from "./user.service";
import { getListUserSchema, updateUserProfileSchema, type GetListUserDto, type UpdateUserProfileDto } from "./dtos";
import { ZodValidationPipe } from "../shared/pipes";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get("profile")
  async getProfile(@Param("id") id: string) {
    return this.userService.getUserProfile(id);
  }
  
  @UsePipes(new ZodValidationPipe(getListUserSchema))
  @Get()
  async getList(@Query() query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
  }

  @UsePipes(new ZodValidationPipe(updateUserProfileSchema))
  @Patch('profile')
  async updateProfile(@Param('id') id: string, @Body() updateData: UpdateUserProfileDto) {
    return this.userService.updateProfile(id, updateData);
  }
}