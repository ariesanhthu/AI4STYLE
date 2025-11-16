import { Post, UnauthorizedException, Headers } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { type ChangePasswordDto, changePasswordSchema, type ForgetPasswordDto, forgetPasswordSchema, type OtpRequestDto, otpRequestSchema, type SignInDto, signInSchema, type VerifyOtpDto } from "../dtos";
import { ApiZodBody, CurrentUser, Public, ZodBody } from "../../shared/decorators";
import { ApiHeader } from "@nestjs/swagger";
import type { JwtPayload, UserInterface } from "../../shared/interfaces";

export abstract class BaseAuthController {
  constructor(protected readonly authService: AuthService) {}
  
  @ApiZodBody(signInSchema)
  @Public()
  @Post('sign-in')
  signIn(@ZodBody(signInSchema) body: SignInDto) {
    return this.authService.signIn(body);
  }

  @Post('sign-out')
  signOut(@CurrentUser() user: JwtPayload) {
    return this.authService.signOut(user.sub);
  }

  @ApiZodBody(changePasswordSchema)
  @Post('change-password')
  changePassword(@ZodBody(changePasswordSchema) body: ChangePasswordDto, @CurrentUser() user: UserInterface) {
    if (body.email.toLowerCase() !== user.email) {
      throw new UnauthorizedException('You can only change your own password');
    }
    return this.authService.changePassword(body);
  }

  @ApiZodBody(forgetPasswordSchema)
  @Public()
  @Post('forget-password')
  forgetPassword(@ZodBody(forgetPasswordSchema) body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }  

  @ApiHeader({ name: 'x-refresh-token', required: true })
  @Post('refresh-token')
  @Public()
  refreshToken(@Headers('x-refresh-token') refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @ApiZodBody(otpRequestSchema)
  @Public()
  @Post('request-otp')
  requestOtp(@ZodBody(otpRequestSchema) body: OtpRequestDto) {
    return this.authService.generateOtp(body);
  }

  @ApiZodBody(otpRequestSchema)
  @Public()
  @Post('verify-otp')
  verifyOtp(@ZodBody(otpRequestSchema) body: VerifyOtpDto) {
    return this.authService.verifyOtp(body);
  }  
}
