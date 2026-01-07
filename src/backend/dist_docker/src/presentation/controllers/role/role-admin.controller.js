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
exports.RoleAdminController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("../../../application/role/services/role.service");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../application/role/dtos");
const enums_1 = require("../../../shared/enums");
const dtos_2 = require("../../../shared/dtos");
let RoleAdminController = class RoleAdminController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    async getListRoles(query) {
        return this.roleService.getListRoles(query);
    }
    async getRoleById(id) {
        return this.roleService.getRoleById(id);
    }
    async createRole(body) {
        return this.roleService.createRole(body);
    }
    async updateRole(id, body) {
        return this.roleService.updateRole(id, body);
    }
    async deleteRole(id) {
        return this.roleService.deleteRole(id);
    }
    async getListPermissions() {
        return this.roleService.getListPermissions();
    }
};
exports.RoleAdminController = RoleAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        description: 'List of roles retrieved successfully',
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.roleResponse),
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of roles with pagination' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListRoleSchema),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListRoleSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "getListRoles", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        description: 'Role retrieved successfully',
        schema: dtos_1.roleResponse,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "getRoleById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        description: 'Role created successfully',
        schema: dtos_1.roleResponse,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new role' }),
    (0, decorators_1.ApiZodBody)(dtos_1.createRoleSchema),
    (0, common_1.Post)('staff'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.createRoleSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "createRole", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        description: 'Role updated successfully',
        schema: dtos_1.roleResponse,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a role by ID' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateRoleSchema),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateRoleSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "updateRole", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        description: 'Role deleted successfully',
        schema: dtos_2.statusResponseSchema,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a role by ID' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "deleteRole", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        description: 'List of permissions retrieved successfully',
        schema: dtos_1.permissionResponseSchema,
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of permissions' }),
    (0, common_1.Get)('permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleAdminController.prototype, "getListPermissions", null);
exports.RoleAdminController = RoleAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.ROLE}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.ROLE_MANAGEMENT),
    (0, common_1.Controller)('/admin/roles'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleAdminController);
//# sourceMappingURL=role-admin.controller.js.map