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
exports.UploadAdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const upload_service_1 = require("../../../application/upload/services/upload.service");
const decorators_1 = require("../../guards/decorators");
const enums_1 = require("../../../shared/enums");
const dtos_1 = require("../../../application/upload/dtos");
const dtos_2 = require("../../../shared/dtos");
let UploadAdminController = class UploadAdminController {
    uploadService;
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadImage(file, title) {
        return this.uploadService.uploadImage(file, title);
    }
    async bulkUploadImages(files, titlesString) {
        const titles = titlesString
            ? titlesString.split(',').map((t) => t.trim())
            : [];
        return this.uploadService.bulkUploadImages(files, titles);
    }
    async getListImages(query) {
        return this.uploadService.getListImages(query);
    }
    async getImageById(id) {
        return this.uploadService.getImageById(id);
    }
    async deleteImage(id) {
        return this.uploadService.deleteImage(id);
    }
    async bulkDeleteImages(body) {
        return this.uploadService.bulkDeleteImages(body.ids);
    }
};
exports.UploadAdminController = UploadAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.imageResponseSchema,
        description: 'Image uploaded successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an image to Cloudinary' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Title of the image',
                    example: 'Product Image',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file to upload',
                },
            },
            required: ['title', 'file'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Post)('images'),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({
                fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
            }),
        ],
    }))),
    __param(1, (0, common_1.Body)('title')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "uploadImage", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.imageArrayResponseSchema,
        description: 'Images uploaded successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk upload images to Cloudinary (max 10 files)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                titles: {
                    type: 'string',
                    description: 'Comma-separated titles for images',
                    example: 'Image 1,Image 2,Image 3',
                },
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'Multiple image files to upload (max 10)',
                },
            },
            required: ['files'],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10)),
    (0, common_1.Post)('images/bulk'),
    __param(0, (0, common_1.UploadedFiles)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
            new common_1.FileTypeValidator({
                fileType: /^image\/(jpeg|jpg|png|gif|webp)$/,
            }),
        ],
    }))),
    __param(1, (0, common_1.Body)('titles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "bulkUploadImages", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.imageResponseSchema),
        description: 'Images list retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of images with pagination' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListImageSchema),
    (0, common_1.Get)('images'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListImageSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "getListImages", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.imageResponseSchema,
        description: 'Image retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get image by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Image ID',
        type: String,
    }),
    (0, common_1.Get)('/images/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "getImageById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Image deleted successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image from Cloudinary and database' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Image ID',
        type: String,
    }),
    (0, common_1.Delete)('/images/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "deleteImage", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Images deleted successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk delete images from Cloudinary and database (max 50)',
    }),
    (0, decorators_1.ApiZodBody)(dtos_1.bulkDeleteImageSchema),
    (0, common_1.Delete)('/images'),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.bulkDeleteImageSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadAdminController.prototype, "bulkDeleteImages", null);
exports.UploadAdminController = UploadAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.UPLOAD}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.IMAGE_MANAGEMENT),
    (0, common_1.Controller)('admin/upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadAdminController);
//# sourceMappingURL=upload-admin.controller.js.map