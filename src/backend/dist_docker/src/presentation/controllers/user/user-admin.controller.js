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
exports.UserAdminController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../../application/user/services/user.service");
const dtos_1 = require("../../../application/user/dtos");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../guards/decorators");
const base_user_controller_1 = require("./base-user.controller");
const enums_1 = require("../../../shared/enums");
const dtos_2 = require("../../../shared/dtos");
let UserAdminController = class UserAdminController extends base_user_controller_1.BaseUserController {
    userService;
    constructor(userService) {
        super(userService);
        this.userService = userService;
    }
    async getList(query) {
        return this.userService.getListOfUsers(query);
    }
    async getProfile(user) {
        return this.userService.getUserProfile(user.id);
    }
    async getById(id) {
        return this.userService.getUserProfile(id);
    }
    async updateById(id, body) {
        return this.userService.updateProfile(id, body);
    }
};
exports.UserAdminController = UserAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.userResponseSchema),
        description: 'List of users retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of users with filtering and pagination' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListUserSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.USER_MANAGEMENT),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListUserSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getList", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.userResponseSchema,
        description: 'User profile retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, common_1.Get)('profile'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getProfile", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.userResponseSchema,
        description: 'User retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile by id' }),
    (0, decorators_1.Permissions)(enums_1.EPermission.USER_MANAGEMENT),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "getById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.userResponseSchema,
        description: 'User updated successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile by id' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateUserSchema),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateUserSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserAdminController.prototype, "updateById", null);
exports.UserAdminController = UserAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.USER}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('admin/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserAdminController);
//# sourceMappingURL=user-admin.controller.js.map