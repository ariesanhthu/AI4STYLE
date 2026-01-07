"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const crypto_1 = require("crypto");
const entities_1 = require("../../../core/upload/entities");
const exceptions_1 = require("../../../core/upload/exceptions");
const enums_1 = require("../../../shared/enums");
class UploadService {
    imageRepository;
    storageProvider;
    logger;
    constructor(imageRepository, storageProvider, logger) {
        this.imageRepository = imageRepository;
        this.storageProvider = storageProvider;
        this.logger = logger;
        this.logger.setContext(UploadService.name);
    }
    async uploadImage(file, title) {
        try {
            const uploadResult = await this.storageProvider.upload(file.buffer);
            const imageEntity = new entities_1.ImageEntity((0, crypto_1.randomUUID)(), title, uploadResult.url, uploadResult.format, uploadResult.size, new Date(), new Date());
            const savedImage = await this.imageRepository.create(imageEntity);
            this.logger.log(`Image uploaded successfully: ${savedImage.id}`);
            return savedImage.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to upload image: ${error.message}`, error.stack);
            throw new exceptions_1.ImageUploadFailedException(error.message);
        }
    }
    async bulkUploadImages(files, titles) {
        const startTime = Date.now();
        const results = {
            success: [],
            failed: [],
            totalTime: 0,
            storageTime: 0,
            databaseTime: 0,
        };
        try {
            this.logger.log(`Starting bulk upload of ${files.length} images`);
            const storageStartTime = Date.now();
            const uploadPromises = files.map((file, index) => this.storageProvider
                .upload(file.buffer)
                .then((response) => ({ success: true, response, index }))
                .catch((error) => ({ success: false, error, index })));
            const uploadResults = await Promise.all(uploadPromises);
            const storageEndTime = Date.now();
            results.storageTime = storageEndTime - storageStartTime;
            this.logger.log(`Storage upload completed in ${results.storageTime}ms`);
            const databaseStartTime = Date.now();
            const successfulUploads = uploadResults.filter((r) => r.success);
            const dbPromises = successfulUploads.map(async (upload) => {
                const index = upload.index;
                const title = titles[index] || `Image ${index + 1}`;
                try {
                    const imageEntity = new entities_1.ImageEntity((0, crypto_1.randomUUID)(), title, upload.response.url, upload.response.format, upload.response.size, new Date(), new Date());
                    const savedImage = await this.imageRepository.create(imageEntity);
                    results.success.push({
                        index,
                        title,
                        image: savedImage.toJSON(),
                    });
                }
                catch (error) {
                    results.failed.push({
                        index,
                        title,
                        error: error.message,
                        stage: 'database',
                    });
                }
            });
            await Promise.all(dbPromises);
            const databaseEndTime = Date.now();
            results.databaseTime = databaseEndTime - databaseStartTime;
            uploadResults
                .filter((r) => !r.success)
                .forEach((upload) => {
                results.failed.push({
                    index: upload.index,
                    title: titles[upload.index] || `Image ${upload.index + 1}`,
                    error: upload.error.message,
                    stage: 'storage',
                });
            });
            results.totalTime = Date.now() - startTime;
            this.logger.log(`Bulk upload completed: ${results.success.length} succeeded, ${results.failed.length} failed`);
            this.logger.log(`Time breakdown - Total: ${results.totalTime}ms, Storage: ${results.storageTime}ms, Database: ${results.databaseTime}ms`);
            return results;
        }
        catch (error) {
            this.logger.error(`Bulk upload failed: ${error.message}`, error.stack);
            throw new exceptions_1.ImageUploadFailedException(error.message);
        }
    }
    async getImageById(id) {
        try {
            const image = await this.imageRepository.findById(id);
            if (!image) {
                throw new exceptions_1.ImageNotFoundException(id);
            }
            return image.toJSON();
        }
        catch (error) {
            this.logger.error(`Failed to get image by id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getListImages(query) {
        try {
            if (!query.limit)
                query.limit = 10;
            if (!query.sortOrder)
                query.sortOrder = enums_1.ESortOrder.DESC;
            query.limit += 1;
            const images = await this.imageRepository.findAll(query);
            const nextCursor = images.length === query.limit ? images[images.length - 1].id : null;
            if (nextCursor) {
                images.pop();
            }
            return {
                items: images.map((image) => image.toJSON()),
                nextCursor,
            };
        }
        catch (error) {
            this.logger.error(`Failed to get list of images: ${error.message}`, error.stack);
            throw error;
        }
    }
    async deleteImage(id) {
        const startTime = Date.now();
        try {
            const image = await this.imageRepository.findById(id);
            if (!image) {
                throw new exceptions_1.ImageNotFoundException(id);
            }
            const publicId = this.extractPublicIdFromUrl(image.url);
            if (publicId) {
                const storageStartTime = Date.now();
                await this.storageProvider.delete(publicId);
                const storageDuration = Date.now() - storageStartTime;
                this.logger.log(`Deleted image from storage (${storageDuration}ms): ${publicId}`);
            }
            const deleted = await this.imageRepository.delete(id);
            if (!deleted) {
                throw new exceptions_1.ImageDeletionFailedException(`Failed to delete image with id ${id} from database`);
            }
            const totalDuration = Date.now() - startTime;
            this.logger.log(`Image deleted successfully (${totalDuration}ms): ${id}`);
            return {
                success: true,
                message: 'Image deleted successfully',
                duration: totalDuration,
            };
        }
        catch (error) {
            this.logger.error(`Failed to delete image: ${error.message}`, error.stack);
            if (error instanceof exceptions_1.ImageNotFoundException) {
                throw error;
            }
            throw new exceptions_1.ImageDeletionFailedException(error.message);
        }
    }
    async bulkDeleteImages(ids) {
        const startTime = Date.now();
        const results = {
            success: [],
            failed: [],
            totalTime: 0,
            storageTime: 0,
            databaseTime: 0,
        };
        try {
            this.logger.log(`Starting bulk delete of ${ids.length} images`);
            const imagePromises = ids.map((id) => this.imageRepository.findById(id).then((image) => ({ id, image })));
            const imageResults = await Promise.all(imagePromises);
            const foundImages = imageResults.filter((r) => r.image !== null);
            const notFoundIds = imageResults
                .filter((r) => r.image === null)
                .map((r) => r.id);
            notFoundIds.forEach((id) => {
                results.failed.push({
                    id,
                    error: 'Image not found',
                    stage: 'fetch',
                });
            });
            const publicIds = foundImages
                .map(({ image }) => this.extractPublicIdFromUrl(image.url))
                .filter((id) => id !== null);
            const storageStartTime = Date.now();
            const storageResults = await this.storageProvider.bulkDelete(publicIds);
            const storageEndTime = Date.now();
            results.storageTime = storageEndTime - storageStartTime;
            this.logger.log(`Storage deletion completed in ${results.storageTime}ms`);
            storageResults.failed.forEach(({ publicId, error }) => {
                this.logger.warn(`Storage deletion failed for ${publicId}: ${error}`);
            });
            const databaseStartTime = Date.now();
            const dbDeletePromises = foundImages.map(({ id }) => this.imageRepository
                .delete(id)
                .then((success) => ({ success, id }))
                .catch((error) => ({ success: false, id, error: error.message })));
            const dbResults = await Promise.all(dbDeletePromises);
            const databaseEndTime = Date.now();
            results.databaseTime = databaseEndTime - databaseStartTime;
            dbResults.forEach((result) => {
                if (result.success) {
                    results.success.push(result.id);
                }
                else {
                    results.failed.push({
                        id: result.id,
                        error: result.error,
                        stage: 'database',
                    });
                }
            });
            results.totalTime = Date.now() - startTime;
            this.logger.log(`Bulk delete completed: ${results.success.length} succeeded, ${results.failed.length} failed`);
            this.logger.log(`Time breakdown - Total: ${results.totalTime}ms, Storage: ${results.storageTime}ms, Database: ${results.databaseTime}ms`);
            return results;
        }
        catch (error) {
            this.logger.error(`Bulk delete failed: ${error.message}`, error.stack);
            throw new exceptions_1.ImageDeletionFailedException(error.message);
        }
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
            this.logger.error(`Failed to extract public_id from URL: ${error.message}`, error.stack);
            return null;
        }
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map