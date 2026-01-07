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
exports.PrismaCategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const entities_1 = require("../../../core/category/entities");
let PrismaCategoryRepository = class PrismaCategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(newEntity) {
        const created = await this.prisma.category.create({
            data: {
                category_id: newEntity.categoryId,
                parent_id: newEntity.parentId,
                name: newEntity.name,
                slug: newEntity.slug,
                icon: newEntity.icon,
                description: newEntity.description,
                search: newEntity.search,
                created_at: newEntity.createdAt,
                updated_at: newEntity.updatedAt,
            },
        });
        return this.toEntity(created);
    }
    async findById(id, options) {
        const category = await this.prisma.category.findUnique({
            where: { category_id: id },
            include: {
                parent: options?.includeParent || false,
            },
        });
        return category ? this.toEntity(category) : null;
    }
    async findBySlug(slug, options) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: options?.includeParent || false,
            },
        });
        return category ? this.toEntity(category) : null;
    }
    async checkUnique(check) {
        const existingCategory = await this.prisma.category.findFirst({
            where: {
                NOT: { category_id: check.excludedId },
                OR: [{ slug: check.slug }, { name: check.name }],
            },
        });
        return !existingCategory;
    }
    async findAll(query, options) {
        const whereClause = {};
        if (query.search) {
            whereClause.search = {
                contains: query.search,
                mode: 'insensitive',
            };
        }
        const categories = await this.prisma.category.findMany({
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { category_id: query.cursor } : undefined,
            orderBy: { created_at: query.sortOrder },
            where: whereClause,
            include: {
                parent: options?.includeParent || false,
            },
        });
        return categories.map((category) => this.toEntity(category));
    }
    async update(updatedEntity) {
        const updated = await this.prisma.category.update({
            where: { category_id: updatedEntity.categoryId },
            data: {
                parent_id: updatedEntity.parentId,
                name: updatedEntity.name,
                slug: updatedEntity.slug,
                icon: updatedEntity.icon,
                description: updatedEntity.description,
                search: updatedEntity.search,
                updated_at: updatedEntity.updatedAt,
            },
        });
        return this.toEntity(updated);
    }
    async delete(id) {
        await this.prisma.category.delete({
            where: { category_id: id },
        });
        return true;
    }
    toEntity(raw) {
        return new entities_1.CategoryEntity(raw.category_id, raw.parent_id, raw.name, raw.slug, raw.icon, raw.description, raw.search, raw.created_at, raw.updated_at, raw.parent ? this.toEntity(raw.parent) : undefined);
    }
};
exports.PrismaCategoryRepository = PrismaCategoryRepository;
exports.PrismaCategoryRepository = PrismaCategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCategoryRepository);
//# sourceMappingURL=prisma-category.repository.js.map