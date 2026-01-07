"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAuthController = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../../application/auth/dtos");
const decorators_1 = require("../../guards/decorators");
const swagger_1 = require("@nestjs/swagger");
const dtos_2 = require("../../../shared/dtos");
class BaseAuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signIn(body) {
        return this.authService.signIn(body);
    }
    signOut(user) {
        if (!user) {
            return;
        }
        return this.authService.signOut(user.id);
    }
    changePassword(body, user) {
        if (body.email.toLowerCase() !== user.email) {
            throw new common_1.UnauthorizedException('You can only change your own password');
        }
        return this.authService.changePassword(body);
    }
    forgetPassword(body) {
        return this.authService.forgetPassword(body);
    }
    refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        return this.authService.refreshToken(refreshToken);
    }
    requestOtp(body) {
        return this.authService.generateOtp(body);
    }
    verifyOtp(body) {
        return this.authService.verifyOtp(body);
    }
}
exports.BaseAuthController = BaseAuthController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.tokenResponseSchema,
        description: 'User signed in successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.signInSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('sign-in'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.signInSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "signIn", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_2.statusResponseSchema,
        description: 'User signed out successfully',
    }),
    (0, common_1.Post)('sign-out'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "signOut", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_2.statusResponseSchema,
        description: 'Password changed successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.changePasswordSchema),
    (0, common_1.Post)('change-password'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.changePasswordSchema)),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "changePassword", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_2.statusResponseSchema,
        description: 'Password reset successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.forgetPasswordSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('forget-password'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.forgetPasswordSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "forgetPassword", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.tokenResponseSchema,
        description: 'Tokens refreshed successfully',
    }),
    (0, swagger_1.ApiHeader)({ name: 'x-refresh-token', required: true }),
    (0, common_1.Post)('refresh-token'),
    (0, decorators_1.Public)(),
    __param(0, (0, common_1.Headers)('x-refresh-token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "refreshToken", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.otpResponseSchema,
        description: 'OTP sent successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.otpRequestSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('request-otp'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.otpRequestSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "requestOtp", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_2.statusResponseSchema,
        description: 'OTP verified successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.otpRequestSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.otpRequestSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAuthController.prototype, "verifyOtp", null);
//# sourceMappingURL=base-auth.controller.js.map