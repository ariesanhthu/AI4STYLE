import { Controller, Get, Query, UsePipes } from "@nestjs/common";
import { UserService } from "../user.service";
import { getListUserSchema, type GetListUserDto } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodQuery } from "../../shared/decorators";
import { BaseUserController } from "./base-user.controller";
import { ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.USER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller("admin/users")
export class UserAdminController extends BaseUserController {
  constructor(
    protected readonly userService: UserService,
  ) {
    super(userService);
  }
  @ApiZodQuery(getListUserSchema)
  @UsePipes(new ZodValidationPipe(getListUserSchema))
  @Get()
  async getList(@Query() query: GetListUserDto) {
    return this.userService.getListOfUsers(query);
  }
}