"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const bcrypt = __importStar(require("bcrypt"));
const enums_1 = require("../../../shared/enums");
const entities_1 = require("../../../core/user/entities");
const helpers_1 = require("../../../shared/helpers");
const exceptions_1 = require("../../../core/auth/exceptions");
const enums_2 = require("../../../core/user/enums");
class AuthService {
    userRepository;
    roleRepository;
    tokenService;
    cacheService;
    logger;
    constructor(userRepository, roleRepository, tokenService, cacheService, logger) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.tokenService = tokenService;
        this.cacheService = cacheService;
        this.logger = logger;
        this.logger.setContext(AuthService.name);
        this.logger.log('AuthService initialized', AuthService.name);
    }
    async generateOtp(body) {
        try {
            const { email } = body;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const key = helpers_1.NormalizedKeyCacheHelper.otpKey(email);
            await this.cacheService.set(key, otp, 5 * 60 * 1000);
            this.logger.log(`Generated OTP for ${email}: ${otp}`, AuthService.name);
            if (process.env.NODE_ENV !== 'production') {
                return { otp };
            }
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to generate OTP: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async signUpGuest(body) {
        try {
            const { email, password, name } = body;
            const normalizeEmail = email.toLowerCase();
            const existingUser = await this.userRepository.findByEmail(normalizeEmail);
            if (existingUser) {
                throw new exceptions_1.EmailAlreadyRegisteredException(normalizeEmail);
            }
            const defaultRole = await this.roleRepository.findByType(enums_1.EUserType.GUEST);
            if (!defaultRole) {
                throw new exceptions_1.RoleNotFoundException();
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new entities_1.UserEntity((0, crypto_1.randomUUID)(), normalizeEmail, '', hashedPassword, name, '', enums_2.EGender.MALE, new Date(), '', (0, helpers_1.buildSearchString)(name, normalizeEmail, ''), new Date(), new Date(), defaultRole.id);
            await this.userRepository.create(newUser);
            this.logger.log(`Guest user created: ${normalizeEmail}`, AuthService.name);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to sign up guest: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async signUpStaff(body) {
        try {
            const { email, password, name, role_id } = body;
            const normalizeEmail = email.toLowerCase();
            const existingUser = await this.userRepository.findByEmail(normalizeEmail);
            if (existingUser) {
                throw new exceptions_1.EmailAlreadyRegisteredException(normalizeEmail);
            }
            const role = await this.roleRepository.findById(role_id);
            if (!role) {
                throw new exceptions_1.RoleNotFoundException();
            }
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = new entities_1.UserEntity((0, crypto_1.randomUUID)(), normalizeEmail, '', hashedPassword, name, '', enums_2.EGender.MALE, new Date(), '', (0, helpers_1.buildSearchString)(name, normalizeEmail, ''), new Date(), new Date(), role.id);
            await this.userRepository.create(newUser);
            this.logger.log(`Staff user created: ${normalizeEmail}`, AuthService.name);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to sign up staff: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async signIn(body) {
        try {
            const { email, password } = body;
            const user = await this.userRepository.findByEmail(email.toLowerCase(), {
                includeRole: true,
            });
            if (!user) {
                throw new exceptions_1.InvalidCredentialsException();
            }
            console.log(user);
            const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
            if (!isPasswordValid) {
                throw new exceptions_1.InvalidCredentialsException();
            }
            const payload = { sub: user.id, email: user.email };
            const token = this.tokenService.sign(payload, { expiresIn: '1h' });
            const refreshToken = this.tokenService.sign(payload, { expiresIn: '7d' });
            await this.cacheService.set(helpers_1.NormalizedKeyCacheHelper.refreshTokenKey(user.id), refreshToken, 7 * 24 * 60 * 60 * 1000);
            this.logger.log(`User signed in: ${user.email}`, AuthService.name);
            return { accessToken: token, refreshToken };
        }
        catch (error) {
            this.logger.error(`Failed to sign in: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async signOut(userId) {
        try {
            await this.cacheService.del(helpers_1.NormalizedKeyCacheHelper.refreshTokenKey(userId));
            this.logger.log(`User signed out: ${userId}`, AuthService.name);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to sign out: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async refreshToken(token) {
        try {
            const decoded = this.tokenService.verify(token);
            const cachedRefreshToken = await this.cacheService.get(helpers_1.NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub));
            if (cachedRefreshToken !== token) {
                throw new exceptions_1.InvalidRefreshTokenException();
            }
            const payload = { sub: decoded.sub, email: decoded.email };
            const newAccessToken = this.tokenService.sign(payload, {
                expiresIn: '1h',
            });
            const newRefreshToken = this.tokenService.sign(payload, {
                expiresIn: '7d',
            });
            await this.cacheService.set(helpers_1.NormalizedKeyCacheHelper.refreshTokenKey(decoded.sub), newRefreshToken, 7 * 24 * 60 * 60 * 1000);
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            this.logger.error(`Failed to refresh token: ${error.message}`, error.stack, AuthService.name);
            throw new exceptions_1.InvalidRefreshTokenException();
        }
    }
    async changePassword(body) {
        try {
            const { email, oldPassword, newPassword } = body;
            const user = await this.userRepository.findByEmail(email.toLowerCase());
            if (!user) {
                throw new exceptions_1.UserNotFoundException();
            }
            const isOldPasswordValid = bcrypt.compareSync(oldPassword, user.hashedPassword);
            if (!isOldPasswordValid) {
                throw new exceptions_1.OldPasswordIncorrectException();
            }
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
            user.hashedPassword = hashedNewPassword;
            await this.userRepository.update(user);
            this.logger.log(`Password changed for user: ${email}`, AuthService.name);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to change password: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async forgetPassword(body) {
        try {
            const { email, newPassword, otp } = body;
            await this.verifyOtp({ email, otp });
            const user = await this.userRepository.findByEmail(email.toLowerCase());
            if (!user) {
                throw new exceptions_1.UserNotFoundException();
            }
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
            user.hashedPassword = hashedNewPassword;
            await this.userRepository.update(user);
            this.logger.log(`Password reset (forgot password) for user: ${email}`, AuthService.name);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to reset password: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
    async verifyOtp(body) {
        try {
            const { email, otp } = body;
            const key = helpers_1.NormalizedKeyCacheHelper.otpKey(email);
            const cachedOtp = await this.cacheService.get(key);
            this.logger.log(`Verifying OTP for ${email}`, AuthService.name);
            if (cachedOtp !== otp) {
                throw new exceptions_1.InvalidOtpException();
            }
            await this.cacheService.del(key);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to verify OTP: ${error.message}`, error.stack, AuthService.name);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map