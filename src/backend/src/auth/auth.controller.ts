import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { type ChangePasswordDto, changePasswordSchema, type ForgetPasswordDto, forgetPasswordSchema, type OtpRequestDto, otpRequestSchema, type SignInDto, signInSchema, type SignUpDto, signUpSchema, type VerifyOtpDto } from "./dtos";
import { ZodValidationPipe } from "../shared/pipes";
import { CurrentUser, Public } from "../shared/decorators";
import { ApiBearerAuth, ApiBody, ApiSecurity, ApiTags } from "@nestjs/swagger";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import type { JwtPayload } from "../shared/interfaces";

@ApiTags('Auth')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  
  @ApiBody({ schema: z.toJSONSchema(signInSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(signInSchema))
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiBody({ schema: z.toJSONSchema(signUpSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(signUpSchema))
  @Post('sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('sign-out')
  signOut(@CurrentUser() user: JwtPayload) {
    return this.authService.signOut(user.sub);
  }

  @ApiBody({ schema: z.toJSONSchema(changePasswordSchema) as SchemaObject })
  @UsePipes(new ZodValidationPipe(changePasswordSchema))
  @Post('change-password')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.authService.changePassword(body);
  }

  @ApiBody({ schema: z.toJSONSchema(forgetPasswordSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(forgetPasswordSchema))
  @Post('forget-password')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @ApiBody({ schema: z.toJSONSchema(otpRequestSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(otpRequestSchema))
  @Post('request-otp')
  requestOtp(@Body() body: OtpRequestDto) {
    return this.authService.generateOtp(body);
  }

  @ApiBody({ schema: z.toJSONSchema(otpRequestSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(otpRequestSchema))
  @Post('verify-otp')
  verifyOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyOtp(body);
  }

} 