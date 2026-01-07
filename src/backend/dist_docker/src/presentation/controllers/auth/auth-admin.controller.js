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
exports.AuthAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_auth_controller_1 = require("./base-auth.controller");
const enums_1 = require("../../../shared/enums");
const dtos_1 = require("../../../shared/dtos");
const decorators_1 = require("../../guards/decorators");
const services_1 = require("../../../application/auth/services");
const dtos_2 = require("../../../application/auth/dtos");
let AuthAdminController = class AuthAdminController extends base_auth_controller_1.BaseAuthController {
    authService;
    constructor(authService) {
        super(authService);
        this.authService = authService;
    }
    signUp(body) {
        return this.authService.signUpStaff(body);
    }
};
exports.AuthAdminController = AuthAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.statusResponseSchema,
        description: 'Staff registered successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_2.signUpStaffSchema),
    (0, common_1.Post)('sign-up'),
    __param(0, (0, decorators_1.ZodBody)(dtos_2.signUpStaffSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthAdminController.prototype, "signUp", null);
exports.AuthAdminController = AuthAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.AUTH}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_1.errorResponseSchema),
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthAdminController);
//# sourceMappingURL=auth-admin.controller.js.map