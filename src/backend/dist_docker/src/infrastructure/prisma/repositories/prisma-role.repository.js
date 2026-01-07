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
var PrismaRoleRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRoleRepository = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../../core/role/entities");
const prisma_service_1 = require("../prisma.service");
let PrismaRoleRepository = PrismaRoleRepository_1 = class PrismaRoleRepository {
    prisma;
    logger = new common_1.Logger(PrismaRoleRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(newEntity) {
        try {
            const created = await this.prisma.role.create({
                data: {
                    id: newEntity.id,
                    name: newEntity.name,
                    description: newEntity.description,
                    type: newEntity.type,
                    permissions: newEntity.permissions,
                    search: newEntity.search,
                    created_at: newEntity.createdAt,
                    updated_at: newEntity.updatedAt,
                },
            });
            return this.toEntity(created);
        }
        catch (error) {
            this.logger.error(`Failed to create role: ${error.message}`);
            throw error;
        }
    }
    async findById(id) {
        const role = await this.prisma.role.findUnique({ where: { id } });
        return role ? this.toEntity(role) : null;
    }
    async findByName(name) {
        const role = await this.prisma.role.findUnique({ where: { name } });
        return role ? this.toEntity(role) : null;
    }
    async findByType(type) {
        const role = await this.prisma.role.findFirst({ where: { type } });
        return role ? this.toEntity(role) : null;
    }
    async findAll(query) {
        const filter = {};
        if (query.type) {
            filter.type = query.type;
        }
        if (query.search) {
            filter.search = {
                contains: query.search,
                mode: 'insensitive',
            };
        }
        const roles = await this.prisma.role.findMany({
            where: filter,
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            orderBy: { created_at: query.sortOrder },
        });
        return roles.map((role) => this.toEntity(role));
    }
    async update(updatedEntity) {
        try {
            const updated = await this.prisma.role.update({
                where: { id: updatedEntity.id },
                data: {
                    name: updatedEntity.name,
                    description: updatedEntity.description,
                    search: updatedEntity.search,
                    updated_at: updatedEntity.updatedAt,
                },
            });
            return this.toEntity(updated);
        }
        catch (error) {
            this.logger.error(`Failed to update role: ${error.message}`);
            return null;
        }
    }
    async delete(id) {
        try {
            await this.prisma.role.delete({ where: { id } });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete role: ${error.message}`);
            return false;
        }
    }
    toEntity(raw) {
        return new entities_1.RoleEntity(raw.id, raw.name, raw.description, raw.type, raw.permissions, raw.search, raw.created_at, raw.updated_at);
    }
};
exports.PrismaRoleRepository = PrismaRoleRepository;
exports.PrismaRoleRepository = PrismaRoleRepository = PrismaRoleRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRoleRepository);
//# sourceMappingURL=prisma-role.repository.js.map