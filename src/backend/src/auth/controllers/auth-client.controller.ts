import { Controller, Post } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ApiZodBody, Public, ZodBody } from "../../shared/decorators";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { BaseAuthController } from "./base-auth.controller";
import { ESwaggerTag, ESwaggerTagPrefix } from "../../shared/enums";
import { type SignUpGuestDto, signUpGuestSchema } from "../dtos";

@ApiTags(`${ESwaggerTagPrefix.CLIENT}-${ESwaggerTag.AUTH}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller('client/auth')
export class AuthClientController extends BaseAuthController{
  constructor(
    protected readonly authService: AuthService,
  ) {
    super(authService);
  }
  @ApiZodBody(signUpGuestSchema)
  @Public()
  @Post('sign-up')
  signUp(@ZodBody(signUpGuestSchema) body: SignUpGuestDto) {
    return this.authService.signUpGuest(body);
  }
}