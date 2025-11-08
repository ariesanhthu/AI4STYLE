import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "../user/repositories/user.repository.interface";
import { JwtService } from "@nestjs/jwt";
import { ChangePasswordDto, ForgetPasswordDto, OtpRequestDto, SignInDto, SignUpGuestDto, SignUpStaffDto, VerifyOtpDto } from "./dtos";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { NormalizedKeyCacheHelper } from "../shared/helpers";
import { UserEntity } from "../user/user.entity";
import type { IRoleRepository } from "../role/repositories/role.repository.interface";
import { randomUUID } from "crypto";
import * as bcrypt from 'bcrypt';
import { JwtPayload } from "../shared/interfaces";
import { EUserType } from "../shared/enums";

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('RoleRepository') private readonly roleRepository: IRoleRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache 
  ) {}

  async generateOtp(body: OtpRequestDto) {
    const { email } = body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = NormalizedKeyCacheHelper.otpKey(email);
    const res = await this.cacheManager.set(key, otp, 5 * 60 * 1000 ); // OTP valid for 5 minutes
    console.log('Generated OTP:', res);
    if (process.env.NODE_ENV !== 'production') {
      return { otp };
    }
    return { success: true };
  }

  async signUpGuest(body: SignUpGuestDto) {
      const { email, password, name, otp } = body;
      await this.verifyOtp({ email, otp });
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('Email is already registered');
      }

      const defaultRole = await this.roleRepository.findByType(EUserType.GUEST);
      if (!defaultRole) {
        throw new BadRequestException('Default role not found');
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new UserEntity(
        randomUUID(),
        email,
        '', 
        hashedPassword,
        name,
        '',
        new Date(),
        '',
        new Date(),
        new Date(),
        defaultRole.id
      );

      await this.userRepository.create(newUser);
      return { success: true };
  }

  async signUpStaff(body: SignUpStaffDto) {
    const { email, password, name, otp, role_id } = body;
    await this.verifyOtp({ email, otp });
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const role = await this.roleRepository.findById(role_id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserEntity(
      randomUUID(),
      email,
      '',
      hashedPassword,
      name,
      '',
      new Date(),
      '',
      new Date(),
      new Date(),
      role.id
    );

    await this.userRepository.create(newUser);
    return { success: true };
  }

  async signIn(body: SignInDto) {
    const { email, password } = body;
    const user = await this.userRepository.findByEmail(email, { includeRole: true });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role?.name };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.cacheManager.set(NormalizedKeyCacheHelper.refreshTokenKey(user.id), refreshToken, 7 * 24 * 60 * 60 );
    return { accessToken: token, refreshToken };
  }

  async signOut(userId: string) {
    await this.cacheManager.del(NormalizedKeyCacheHelper.refreshTokenKey(userId));
    return { success: true };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify<{ sub: string; email: string }>(token);
      const cachedRefreshToken = await this.cacheManager.get<string>(NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub));
      if (cachedRefreshToken !== token) {
        throw new BadRequestException('Invalid refresh token');
      }

      const payload = { sub: decoded.sub, email: decoded.email };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.cacheManager.set(NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub), newRefreshToken, 7 * 24 * 60 * 60 );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async changePassword(body: ChangePasswordDto) {
    const { email, oldPassword, newPassword } = body;
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.hashedPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.hashedPassword = hashedNewPassword;
    await this.userRepository.update(user);
    return { success: true };
  }

  async forgetPassword(body: ForgetPasswordDto) {
    const { email, newPassword, otp } = body;
    await this.verifyOtp({ email, otp });
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.hashedPassword = hashedNewPassword;
    await this.userRepository.update(user);
    return { success: true };
  }

  async verifyOtp(body: VerifyOtpDto) {
    const { email, otp } = body;
    const key = NormalizedKeyCacheHelper.otpKey(email);
    const cachedOtp = await this.cacheManager.get<string>(key);
    console.log('Cached OTP:', cachedOtp);
    if (cachedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.cacheManager.del(key);
    return { success: true };
  }
}