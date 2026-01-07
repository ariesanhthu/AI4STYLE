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
var CloudinaryStorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryStorageProvider = CloudinaryStorageProvider_1 = class CloudinaryStorageProvider {
    configService;
    logger = new common_1.Logger(CloudinaryStorageProvider_1.name);
    DEFAULT_FOLDER;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
        this.DEFAULT_FOLDER = this.configService.get('CLOUDINARY_UPLOAD_PRESET');
    }
    async upload(file, options) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_chunked_stream({
                folder: options?.folder || this.DEFAULT_FOLDER,
                resource_type: 'auto',
                public_id: options?.filename,
            }, (error, result) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                if (error) {
                    this.logger.error(`Cloudinary upload error (${duration}ms): ${error.message}`);
                    reject(error);
                }
                else if (result) {
                    this.logger.log(`Cloudinary upload successful (${duration}ms): ${result.public_id}`);
                    resolve(this.mapToUploadResult(result));
                }
                else {
                    this.logger.error(`Cloudinary upload error (${duration}ms): No result returned`);
                    reject(new Error('No result returned from Cloudinary'));
                }
            });
            uploadStream.end(file);
        });
    }
    async delete(publicId) {
        try {
            const startTime = Date.now();
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            const duration = Date.now() - startTime;
            if (result.result === 'ok' || result.result === 'not found') {
                this.logger.log(`Deleted from Cloudinary (${duration}ms): ${publicId}`);
                return true;
            }
            this.logger.warn(`Failed to delete from Cloudinary (${duration}ms): ${publicId}, result: ${result.result}`);
            return false;
        }
        catch (error) {
            this.logger.error(`Error deleting from Cloudinary: ${publicId}, ${error.message}`);
            return false;
        }
    }
    async bulkDelete(publicIds) {
        const startTime = Date.now();
        const results = {
            success: [],
            failed: [],
        };
        try {
            this.logger.log(`Starting bulk delete of ${publicIds.length} files from Cloudinary`);
            const deletePromises = publicIds.map((publicId) => cloudinary_1.v2.uploader
                .destroy(publicId)
                .then((result) => ({ success: result.result === 'ok' || result.result === 'not found', publicId }))
                .catch((error) => ({ success: false, publicId, error: error.message })));
            const deleteResults = await Promise.all(deletePromises);
            deleteResults.forEach((result) => {
                if (result.success) {
                    results.success.push(result.publicId);
                }
                else {
                    results.failed.push({
                        publicId: result.publicId,
                        error: result.error || 'Unknown error',
                    });
                }
            });
            const duration = Date.now() - startTime;
            this.logger.log(`Bulk delete completed (${duration}ms): ${results.success.length} succeeded, ${results.failed.length} failed`);
            return results;
        }
        catch (error) {
            this.logger.error(`Bulk delete failed: ${error.message}`);
            throw error;
        }
    }
    mapToUploadResult(result) {
        return {
            url: result.secure_url,
            format: result.format,
            size: result.bytes,
            publicId: result.public_id,
        };
    }
    extractPublicIdFromUrl(url) {
        try {
            const urlParts = url.split('/');
            const uploadIndex = urlParts.indexOf('upload');
            if (uploadIndex === -1)
                return null;
            const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
            const publicIdWithFolder = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.'));
            return publicIdWithFolder;
        }
        catch (error) {
            this.logger.error(`Failed to extract public_id from URL: ${error.message}`);
            return null;
        }
    }
};
exports.CloudinaryStorageProvider = CloudinaryStorageProvider;
exports.CloudinaryStorageProvider = CloudinaryStorageProvider = CloudinaryStorageProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryStorageProvider);
//# sourceMappingURL=cloudinary-storage.provider.js.map