import {
  ChangePasswordDto,
  ForgetPasswordDto,
  OtpRequestDto,
  SignInDto,
  SignUpGuestDto,
  SignUpStaffDto,
  VerifyOtpDto,
} from '../dtos';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { type IUserRepository } from '@/core/user/interfaces';
import { type IRoleRepository } from '@/core/role/interfaces';
import { EUserType } from '@/shared/enums';
import { JwtPayload } from '@/shared/interfaces';
import { UserEntity } from '@/core/user/entities';
import { NormalizedKeyCacheHelper } from '@/shared/helpers';
import {
  EmailAlreadyRegisteredException,
  InvalidCredentialsException,
  InvalidOtpException,
  InvalidRefreshTokenException,
  OldPasswordIncorrectException,
  RoleNotFoundException,
  UserNotFoundException,
} from '@/core/auth/exceptions';
import {
  ICacheService,
  ILoggerService,
  ITokenService,
} from '@/shared/interfaces';
import { EGender } from '@/core/user/enums';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly tokenService: ITokenService,
    private readonly cacheService: ICacheService,
    private readonly logger: ILoggerService,
  ) {
    this.logger.setContext(AuthService.name);
    this.logger.log('AuthService initialized', AuthService.name);
  }

  async generateOtp(body: OtpRequestDto) {
    try {
      const { email } = body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const key = NormalizedKeyCacheHelper.otpKey(email);
      await this.cacheService.set(key, otp, 5 * 60 * 1000); // OTP valid for 5 minutes
      this.logger.log(`Generated OTP for ${email}: ${otp}`, AuthService.name);
      if (process.env.NODE_ENV !== 'production') {
        return { otp };
      }
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to generate OTP: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async signUpGuest(body: SignUpGuestDto) {
    try {
      const { email, password, name } = body;
      const normalizeEmail = email.toLowerCase();
      // await this.verifyOtp({ email: normalizeEmail, otp });
      const existingUser = await this.userRepository.findByEmail(normalizeEmail);
      if (existingUser) {
        throw new EmailAlreadyRegisteredException(normalizeEmail);
      }

      const defaultRole = await this.roleRepository.findByType(EUserType.GUEST);
      if (!defaultRole) {
        throw new RoleNotFoundException();
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new UserEntity(
        randomUUID(),
        normalizeEmail,
        '',
        hashedPassword,
        name,
        '',
        EGender.MALE,
        new Date(),
        '',
        new Date(),
        new Date(),
        defaultRole.id,
      );

      await this.userRepository.create(newUser);
      this.logger.log(
        `Guest user created: ${normalizeEmail}`,
        AuthService.name,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to sign up guest: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async signUpStaff(body: SignUpStaffDto) {
    try {
      const { email, password, name, role_id } = body;
      const normalizeEmail = email.toLowerCase();
      // await this.verifyOtp({ email, otp });
      const existingUser = await this.userRepository.findByEmail(normalizeEmail);
      if (existingUser) {
        throw new EmailAlreadyRegisteredException(normalizeEmail);
      }

      const role = await this.roleRepository.findById(role_id);
      if (!role) {
        throw new RoleNotFoundException();
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = new UserEntity(
        randomUUID(),
        normalizeEmail,
        '',
        hashedPassword,
        name,
        '',
        EGender.MALE,
        new Date(),
        '',
        new Date(),
        new Date(),
        role.id,
      );

      await this.userRepository.create(newUser);
      this.logger.log(
        `Staff user created: ${normalizeEmail}`,
        AuthService.name,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to sign up staff: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async signIn(body: SignInDto) {
    try {
      const { email, password } = body;
      const user = await this.userRepository.findByEmail(email.toLowerCase(), {
        includeRole: true,
      });
      if (!user) {
        throw new InvalidCredentialsException();
      }

      const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
      if (!isPasswordValid) {
        throw new InvalidCredentialsException();
      }

      const payload: JwtPayload = { sub: user.id, email: user.email };
      const token = this.tokenService.sign(payload, { expiresIn: '1h' });

      const refreshToken = this.tokenService.sign(payload, { expiresIn: '7d' });

      await this.cacheService.set(
        NormalizedKeyCacheHelper.refreshTokenKey(user.id),
        refreshToken,
        7 * 24 * 60 * 60 * 1000, // Cache TTL is usually in milliseconds
      );
      this.logger.log(`User signed in: ${user.email}`, AuthService.name);
      return { accessToken: token, refreshToken };
    } catch (error) {
      this.logger.error(
        `Failed to sign in: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async signOut(userId: string) {
    try {
      await this.cacheService.del(
        NormalizedKeyCacheHelper.refreshTokenKey(userId),
      );
      this.logger.log(`User signed out: ${userId}`, AuthService.name);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to sign out: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.tokenService.verify<{ sub: string; email: string }>(
        token,
      );
      const cachedRefreshToken = await this.cacheService.get<string>(
        NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub),
      );
      if (cachedRefreshToken !== token) {
        throw new InvalidRefreshTokenException();
      }

      const payload = { sub: decoded.sub, email: decoded.email };
      const newAccessToken = this.tokenService.sign(payload, {
        expiresIn: '1h',
      });
      const newRefreshToken = this.tokenService.sign(payload, {
        expiresIn: '7d',
      });

      await this.cacheService.set(
        NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub),
        newRefreshToken,
        7 * 24 * 60 * 60 * 1000,
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(
        `Failed to refresh token: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw new InvalidRefreshTokenException();
    }
  }

  async changePassword(body: ChangePasswordDto) {
    try {
      const { email, oldPassword, newPassword } = body;
      const user = await this.userRepository.findByEmail(email.toLowerCase());
      if (!user) {
        throw new UserNotFoundException();
      }

      const isOldPasswordValid = bcrypt.compareSync(
        oldPassword,
        user.hashedPassword,
      );
      if (!isOldPasswordValid) {
        throw new OldPasswordIncorrectException();
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      user.hashedPassword = hashedNewPassword;
      await this.userRepository.update(user);
      this.logger.log(`Password changed for user: ${email}`, AuthService.name);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to change password: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async forgetPassword(body: ForgetPasswordDto) {
    try {
      const { email, newPassword, otp } = body;
      await this.verifyOtp({ email, otp });
      const user = await this.userRepository.findByEmail(email.toLowerCase());
      if (!user) {
        throw new UserNotFoundException();
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      user.hashedPassword = hashedNewPassword;
      await this.userRepository.update(user);
      this.logger.log(
        `Password reset (forgot password) for user: ${email}`,
        AuthService.name,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to reset password: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }

  async verifyOtp(body: VerifyOtpDto) {
    try {
      const { email, otp } = body;
      const key = NormalizedKeyCacheHelper.otpKey(email);
      const cachedOtp = await this.cacheService.get<string>(key);
      this.logger.log(`Verifying OTP for ${email}`, AuthService.name);
      if (cachedOtp !== otp) {
        throw new InvalidOtpException();
      }
      await this.cacheService.del(key);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to verify OTP: ${error.message}`,
        error.stack,
        AuthService.name,
      );
      throw error;
    }
  }
}



