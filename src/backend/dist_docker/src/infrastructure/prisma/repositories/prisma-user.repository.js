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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const entities_1 = require("../../../core/user/entities");
const entities_2 = require("../../../core/role/entities");
let PrismaUserRepository = class PrismaUserRepository {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(newEntity) {
        const createdUser = await this.prismaService.user.create({
            data: {
                id: newEntity.id,
                email: newEntity.email,
                name: newEntity.name,
                hashed_password: newEntity.hashedPassword,
                address: newEntity.address,
                avatar: newEntity.avatar,
                birthdate: newEntity.birthdate,
                phone: newEntity.phone,
                gender: newEntity.gender,
                search: newEntity.search,
                role_id: newEntity.roleId,
                created_at: newEntity.createdAt,
                updated_at: newEntity.updatedAt,
            },
        });
        return this.toEntity(createdUser);
    }
    async findById(id, options) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: options?.includeRole ? { roles: true } : undefined,
        });
        return user ? this.toEntity(user) : null;
    }
    async findByEmail(email, options) {
        const user = await this.prismaService.user.findUnique({
            where: { email },
            include: options?.includeRole ? { roles: true } : undefined,
        });
        return user ? this.toEntity(user) : null;
    }
    async findAll(query, options) {
        const filter = {};
        if (query.type) {
            filter.roles = { type: query.type };
        }
        if (query.roleId) {
            filter.role_id = query.roleId;
        }
        if (query.search) {
            filter.search = { contains: query.search };
        }
        const users = await this.prismaService.user.findMany({
            omit: { hashed_password: true },
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            where: filter,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            orderBy: { created_at: 'desc' },
            include: options?.includeRole ? { roles: true } : undefined,
        });
        return users.map((user) => this.toEntity(user));
    }
    async update(updatedEntity) {
        const updatedUser = await this.prismaService.user.update({
            where: { id: updatedEntity.id },
            data: {
                email: updatedEntity.email,
                name: updatedEntity.name,
                hashed_password: updatedEntity.hashedPassword,
                address: updatedEntity.address,
                avatar: updatedEntity.avatar,
                birthdate: updatedEntity.birthdate,
                phone: updatedEntity.phone,
                gender: updatedEntity.gender,
                search: updatedEntity.search,
                role_id: updatedEntity.roleId,
                updated_at: updatedEntity.updatedAt,
            },
        });
        return this.toEntity(updatedUser);
    }
    async delete(id) {
        await this.prismaService.user.delete({
            where: { id },
        });
        return true;
    }
    toEntity(raw) {
        return new entities_1.UserEntity(raw.id, raw.email, raw.phone, raw.hashed_password, raw.name, raw.avatar, raw.gender, raw.birthdate, raw.address, raw.search, raw.updated_at, raw.created_at, raw.role_id, raw.roles
            ? new entities_2.RoleEntity(raw.roles.id, raw.roles.name, raw.roles.description, raw.roles.type, raw.roles.permissions, raw.roles.search, raw.roles.created_at, raw.roles.updated_at)
            : undefined);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map