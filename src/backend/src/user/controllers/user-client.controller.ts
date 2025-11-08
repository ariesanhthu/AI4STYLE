import { Controller } from "@nestjs/common";
import { UserService } from "../user.service";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { BaseUserController } from "./base-user.controller";
import { ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.USER}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller("client/users")
export class UserClientController extends BaseUserController {
  constructor(
    protected readonly userService: UserService,
  ) {
    super(userService);
  }
}