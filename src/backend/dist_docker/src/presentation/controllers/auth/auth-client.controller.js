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
exports.AuthClientController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../../application/auth/services/auth.service");
const decorators_1 = require("../../guards/decorators");
const swagger_1 = require("@nestjs/swagger");
const base_auth_controller_1 = require("./base-auth.controller");
const enums_1 = require("../../../shared/enums");
const dtos_1 = require("../../../application/auth/dtos");
const dtos_2 = require("../../../shared/dtos");
let AuthClientController = class AuthClientController extends base_auth_controller_1.BaseAuthController {
    authService;
    constructor(authService) {
        super(authService);
        this.authService = authService;
    }
    signUp(body) {
        return this.authService.signUpGuest(body);
    }
};
exports.AuthClientController = AuthClientController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_2.statusResponseSchema,
        description: 'User registered successfully',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.signUpGuestSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Post)('sign-up'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.signUpGuestSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthClientController.prototype, "signUp", null);
exports.AuthClientController = AuthClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.AUTH}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('client/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthClientController);
//# sourceMappingURL=auth-client.controller.js.map