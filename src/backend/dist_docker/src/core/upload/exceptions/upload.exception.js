"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageDeletionFailedException = exports.ImageUploadFailedException = exports.ImageNotFoundException = exports.UploadException = void 0;
class UploadException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UploadException';
    }
}
exports.UploadException = UploadException;
class ImageNotFoundException extends UploadException {
    constructor(identifier) {
        super(`Image with identifier ${identifier} not found`);
        this.name = 'ImageNotFoundException';
    }
}
exports.ImageNotFoundException = ImageNotFoundException;
class ImageUploadFailedException extends UploadException {
    constructor(reason) {
        super(`Failed to upload image: ${reason}`);
        this.name = 'ImageUploadFailedException';
    }
}
exports.ImageUploadFailedException = ImageUploadFailedException;
class ImageDeletionFailedException extends UploadException {
    constructor(reason) {
        super(`Failed to delete image: ${reason}`);
        this.name = 'ImageDeletionFailedException';
    }
}
exports.ImageDeletionFailedException = ImageDeletionFailedException;
//# sourceMappingURL=upload.exception.js.map