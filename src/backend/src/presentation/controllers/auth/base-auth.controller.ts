import { Post, UnauthorizedException, Headers } from '@nestjs/common';
import { AuthService } from '@/application/auth/services/auth.service';
import {
  type ChangePasswordDto,
  changePasswordSchema,
  type ForgetPasswordDto,
  forgetPasswordSchema,
  type OtpRequestDto,
  otpRequestSchema,
  type SignInDto,
  signInSchema,
  type VerifyOtpDto,
  otpResponseSchema,
  tokenResponseSchema,
} from '@/application/auth/dtos';
import {
  ApiZodBody,
  ApiZodResponse,
  CurrentUser,
  Public,
  ZodBody,
} from '@/presentation/guards/decorators';
import { ApiHeader } from '@nestjs/swagger';
import type { UserInterface } from '@/shared/interfaces';
import { statusResponseSchema } from '@/shared/dtos';

export abstract class BaseAuthController {
  constructor(protected readonly authService: AuthService) { }

  @ApiZodResponse({
    status: 201,
    schema: tokenResponseSchema,
    description: 'User signed in successfully',
  })
  @ApiZodBody(signInSchema)
  @Public()
  @Post('sign-in')
  signIn(@ZodBody(signInSchema) body: SignInDto) {
    return this.authService.signIn(body);
  }

  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'User signed out successfully',
  })
  @Post('sign-out')
  signOut(@CurrentUser() user: UserInterface) {
    if (!user) {
      return;
    }
    return this.authService.signOut(user.id);
  }

  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'Password changed successfully',
  })
  @ApiZodBody(changePasswordSchema)
  @Post('change-password')
  changePassword(
    @ZodBody(changePasswordSchema) body: ChangePasswordDto,
    @CurrentUser() user: UserInterface,
  ) {
    if (body.email.toLowerCase() !== user.email) {
      throw new UnauthorizedException('You can only change your own password');
    }
    return this.authService.changePassword(body);
  }

  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'Password reset successfully',
  })
  @ApiZodBody(forgetPasswordSchema)
  @Public()
  @Post('forget-password')
  forgetPassword(@ZodBody(forgetPasswordSchema) body: ForgetPasswordDto) {
    return this.authService.forgetPassword(body);
  }

  @ApiZodResponse({
    status: 201,
    schema: tokenResponseSchema,
    description: 'Tokens refreshed successfully',
  })
  @ApiHeader({ name: 'x-refresh-token', required: true })
  @Post('refresh-token')
  @Public()
  refreshToken(@Headers('x-refresh-token') refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

  @ApiZodResponse({
    status: 201,
    schema: otpResponseSchema,
    description: 'OTP sent successfully',
  })
  @ApiZodBody(otpRequestSchema)
  @Public()
  @Post('request-otp')
  requestOtp(@ZodBody(otpRequestSchema) body: OtpRequestDto) {
    return this.authService.generateOtp(body);
  }

  @ApiZodResponse({
    status: 201,
    schema: statusResponseSchema,
    description: 'OTP verified successfully',
  })
  @ApiZodBody(otpRequestSchema)
  @Public()
  @Post('verify-otp')
  verifyOtp(@ZodBody(otpRequestSchema) body: VerifyOtpDto) {
    return this.authService.verifyOtp(body);
  }
}
