export declare class UploadException extends Error {
    constructor(message: string);
}
export declare class ImageNotFoundException extends UploadException {
    constructor(identifier: string);
}
export declare class ImageUploadFailedException extends UploadException {
    constructor(reason: string);
}
export declare class ImageDeletionFailedException extends UploadException {
    constructor(reason: string);
}
