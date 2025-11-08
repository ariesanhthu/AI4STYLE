import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type SignUpStaffDto, signUpStaffSchema } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
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
  @ApiBody({ schema: z.toJSONSchema(signUpStaffSchema) as SchemaObject })
  @UsePipes(new ZodValidationPipe(signUpStaffSchema))
  @Post('sign-up')
  signUp(@Body() body: SignUpStaffDto) {
    return this.authService.signUpStaff(body);
  }
}