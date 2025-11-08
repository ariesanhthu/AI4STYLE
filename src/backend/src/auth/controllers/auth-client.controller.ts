import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ZodValidationPipe } from "../../shared/pipes";
import { Public } from "../../shared/decorators";
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
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
  @ApiBody({ schema: z.toJSONSchema(signUpGuestSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(signUpGuestSchema))
  @Post('sign-up')
  signUp(@Body() body: SignUpGuestDto) {
    return this.authService.signUpGuest(body);
  }
}