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
var PrismaImageRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaImageRepository = void 0;
const entities_1 = require("../../../core/upload/entities");
const prisma_service_1 = require("../prisma.service");
const common_1 = require("@nestjs/common");
let PrismaImageRepository = PrismaImageRepository_1 = class PrismaImageRepository {
    prisma;
    logger = new common_1.Logger(PrismaImageRepository_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(newEntity) {
        try {
            const created = await this.prisma.image.create({
                data: {
                    id: newEntity.id,
                    title: newEntity.title,
                    url: newEntity.url,
                    format: newEntity.format,
                    size: newEntity.size,
                    created_at: newEntity.createdAt,
                    updated_at: newEntity.updatedAt,
                },
            });
            return this.toEntity(created);
        }
        catch (error) {
            this.logger.error(`Failed to create image: ${error.message}`);
            throw error;
        }
    }
    async findById(id) {
        try {
            const image = await this.prisma.image.findUnique({
                where: { id },
            });
            return image ? this.toEntity(image) : null;
        }
        catch (error) {
            this.logger.error(`Failed to find image by id: ${error.message}`);
            return null;
        }
    }
    async findAll(query) {
        try {
            const images = await this.prisma.image.findMany({
                take: query.limit,
                skip: query.cursor ? 1 : 0,
                cursor: query.cursor ? { id: query.cursor } : undefined,
                orderBy: { created_at: query.sortOrder },
            });
            return images.map((image) => this.toEntity(image));
        }
        catch (error) {
            this.logger.error(`Failed to find all images: ${error.message}`);
            return [];
        }
    }
    async delete(id) {
        try {
            await this.prisma.image.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to delete image: ${error.message}`);
            return false;
        }
    }
    toEntity(raw) {
        return new entities_1.ImageEntity(raw.id, raw.title, raw.url, raw.format, raw.size, raw.created_at, raw.updated_at);
    }
};
exports.PrismaImageRepository = PrismaImageRepository;
exports.PrismaImageRepository = PrismaImageRepository = PrismaImageRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaImageRepository);
//# sourceMappingURL=prisma-image.repository.js.map