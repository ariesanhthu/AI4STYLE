import { Body, Post, UnauthorizedException, UsePipes, Headers } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type ChangePasswordDto, changePasswordSchema, type ForgetPasswordDto, forgetPasswordSchema, type OtpRequestDto, otpRequestSchema, type SignInDto, signInSchema, type VerifyOtpDto } from "../dtos";
import { ZodValidationPipe } from "../../shared/pipes";
import { CurrentUser, Public } from "../../shared/decorators";
import { ApiBody, ApiHeader } from "@nestjs/swagger";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import type { JwtPayload, UserInterface } from "../../shared/interfaces";

export abstract class BaseAuthController {
  constructor(protected readonly authService: AuthService) {}
  
  @ApiBody({ schema: z.toJSONSchema(signInSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(signInSchema))
  @Post('sign-in')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  signOut(@CurrentUser() user: JwtPayload) {
    return this.authService.signOut(user.sub);
  }

  @ApiBody({ schema: z.toJSONSchema(changePasswordSchema) as SchemaObject })
  @Post('change-password')
  changePassword(@Body(new ZodValidationPipe(changePasswordSchema)) body: ChangePasswordDto, @CurrentUser() user: UserInterface) {
    if (body.email.toLowerCase() !== user.email) {
      throw new UnauthorizedException('You can only change your own password');
    }
    return this.authService.changePassword(body);
  }

  @ApiBody({ schema: z.toJSONSchema(forgetPasswordSchema) as SchemaObject })
  @Public()
  @UsePipes(new ZodValidationPipe(forgetPasswordSchema))
  @Post('forget-password')
  forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }  

  @ApiHeader({ name: 'x-refresh-token', required: true })
  @Public()
  @Post('refresh-token')
  refreshToken(@Headers('x-refresh-token') refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
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
