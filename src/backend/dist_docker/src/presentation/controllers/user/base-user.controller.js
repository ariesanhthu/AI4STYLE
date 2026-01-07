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
exports.BaseUserController = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../../application/user/dtos");
const decorators_1 = require("../../guards/decorators");
const api_operation_decorator_1 = require("@nestjs/swagger/dist/decorators/api-operation.decorator");
class BaseUserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getProfile(user) {
        return this.userService.getUserProfile(user.id);
    }
    async updateProfile(user, updateData) {
        console.log('Update Data:', updateData);
        return this.userService.updateProfile(user.id, updateData);
    }
}
exports.BaseUserController = BaseUserController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.userResponseSchema,
        description: 'User profile retrieved successfully',
    }),
    (0, api_operation_decorator_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, common_1.Get)('profile'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseUserController.prototype, "getProfile", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.userResponseSchema,
        description: 'User profile updated successfully',
    }),
    (0, api_operation_decorator_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateUserProfileSchema),
    (0, common_1.Patch)('profile'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateUserProfileSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BaseUserController.prototype, "updateProfile", null);
//# sourceMappingURL=base-user.controller.js.map