"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleEntity = void 0;
class RoleEntity {
    id;
    name;
    description;
    type;
    permissions;
    search;
    createdAt;
    updatedAt;
    constructor(id, name, description, type, permissions, search, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.permissions = permissions;
        this.search = search;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            permissions: this.permissions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.RoleEntity = RoleEntity;
//# sourceMappingURL=role.entity.js.map