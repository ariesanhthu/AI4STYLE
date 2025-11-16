import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type SignUpStaffDto, signUpStaffSchema } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodBody } from "../../shared/decorators";
import { BaseAuthController } from "./base-auth.controller";
import { ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.AUTH}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller('admin/auth')
export class AuthAdminController extends BaseAuthController{
  constructor(
    protected readonly authService: AuthService,
  ) {
    super(authService);
  }
  @ApiZodBody(signUpStaffSchema)
  @UsePipes(new ZodValidationPipe(signUpStaffSchema))
  @Post('sign-up')
  signUp(@Body() body: SignUpStaffDto) {
    return this.authService.signUpStaff(body);
  }
}