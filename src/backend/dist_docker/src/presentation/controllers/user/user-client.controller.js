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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClientController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../../../application/user/services/user.service");
const swagger_1 = require("@nestjs/swagger");
const base_user_controller_1 = require("./base-user.controller");
const enums_1 = require("../../../shared/enums");
const dtos_1 = require("../../../shared/dtos");
const decorators_1 = require("../../guards/decorators");
let UserClientController = class UserClientController extends base_user_controller_1.BaseUserController {
    userService;
    constructor(userService) {
        super(userService);
        this.userService = userService;
    }
};
exports.UserClientController = UserClientController;
exports.UserClientController = UserClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.USER}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_1.errorResponseSchema),
    (0, common_1.Controller)('client/users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserClientController);
//# sourceMappingURL=user-client.controller.js.map