"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleService = void 0;
const crypto_1 = require("crypto");
const helpers_1 = require("../../../shared/helpers");
const enums_1 = require("../../../shared/enums");
const entities_1 = require("../../../core/role/entities");
const exceptions_1 = require("../../../core/role/exceptions");
class RoleService {
    roleRepository;
    logger;
    constructor(roleRepository, logger) {
        this.roleRepository = roleRepository;
        this.logger = logger;
        this.logger.setContext(RoleService.name);
    }
    async createRole(newRole) {
        try {
            const existed = await this.roleRepository.findByName(newRole.name);
            if (existed) {
                throw new exceptions_1.RoleAlreadyExistsException(newRole.name);
            }
            const roleEntity = new entities_1.RoleEntity((0, crypto_1.randomUUID)(), newRole.name, newRole.description ?? '', enums_1.EUserType.STAFF, newRole.permissions, (0, helpers_1.buildSearchString)(newRole.name, newRole.description ?? ''), new Date(), new Date());
            const createdRole = await this.roleRepository.create(roleEntity);
            this.logger.log(`Role created: ${createdRole.id}`);
            return createdRole.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getRoleById(id) {
        try {
            const role = await this.roleRepository.findById(id);
            if (!role) {
                throw new exceptions_1.RoleNotFoundException(id);
            }
            return role.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get role by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getRoleByName(name) {
        try {
            const role = await this.roleRepository.findByName(name);
            if (!role) {
                throw new exceptions_1.RoleNotFoundException(name);
            }
            return role.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get role by name ${name}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getListRoles(query) {
        try {
            if (query.search) {
                query.search = (0, helpers_1.buildSearchString)(query.search);
            }
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const roles = await this.roleRepository.findAll(query);
            const nextCursor = roles.length === query.limit ? roles[roles.length - 1].id : null;
            if (nextCursor) {
                roles.pop();
            }
            return {
                items: roles.map((role) => role.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get list of roles: ${error.message}`, error.stack);
            throw error;
        }
    }
    getListPermissions() {
        const permissions = {
            permissions: Object.values(enums_1.EPermission),
        };
        return permissions;
    }
    async updateRole(id, updatedRole) {
        try {
            const existingRole = await this.roleRepository.findById(id);
            if (!existingRole) {
                throw new exceptions_1.RoleNotFoundException(id);
            }
            if (existingRole.type === enums_1.EUserType.ADMIN) {
                throw new exceptions_1.RoleRootAdminCannotBeUpdatedException();
            }
            if (existingRole.type === enums_1.EUserType.GUEST) {
                throw new exceptions_1.RoleGuestCannotBeUpdatedException();
            }
            if (updatedRole.name) {
                const roleWithName = await this.roleRepository.findByName(updatedRole.name);
                if (roleWithName && roleWithName.id !== id) {
                    throw new exceptions_1.RoleAlreadyExistsException(updatedRole.name);
                }
                existingRole.name = updatedRole.name;
            }
            if (updatedRole.description !== undefined) {
                existingRole.description = updatedRole.description;
            }
            existingRole.search = (0, helpers_1.buildSearchString)(existingRole.name, existingRole.description ?? '');
            existingRole.updatedAt = new Date();
            const role = await this.roleRepository.update(existingRole);
            if (!role) {
                throw new exceptions_1.RoleUpdateException(`Failed to update role with id ${id}`);
            }
            this.logger.log(`Role updated: ${id}`);
            return role.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to update role with id ${id}: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.RoleNotFoundException ||
                error instanceof exceptions_1.RoleAlreadyExistsException) {
                throw error;
            }
            throw new exceptions_1.RoleUpdateException(error.message);
        }
    }
    async deleteRole(id) {
        try {
            const role = await this.roleRepository.findById(id);
            if (!role) {
                throw new exceptions_1.RoleNotFoundException(id);
            }
            if (role.type === enums_1.EUserType.ADMIN) {
                throw new exceptions_1.RoleRootAdminCannotBeDeletedException();
            }
            if (role.type === enums_1.EUserType.GUEST) {
                throw new exceptions_1.RoleGuestCannotBeDeletedException();
            }
            const deleted = await this.roleRepository.delete(id);
            if (!deleted) {
                throw new exceptions_1.RoleDeletionException(`Failed to delete role with id ${id}`);
            }
            this.logger.log(`Role deleted: ${id}`);
            return { success: true };
        }
        catch (error) {
            this.logger.error(`Failed to delete role with id ${id}: ${error.message}`, error.stack);
            throw new exceptions_1.RoleDeletionException(error.message);
        }
    }
}
exports.RoleService = RoleService;
//# sourceMappingURL=role.service.js.map