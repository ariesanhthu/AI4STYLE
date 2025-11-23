export class UploadException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadException';
  }
}

export class ImageNotFoundException extends UploadException {
  constructor(identifier: string) {
    super(`Image with identifier ${identifier} not found`);
    this.name = 'ImageNotFoundException';
  }
}

export class ImageUploadFailedException extends UploadException {
  constructor(reason: string) {
    super(`Failed to upload image: ${reason}`);
    this.name = 'ImageUploadFailedException';
  }
}

export class ImageDeletionFailedException extends UploadException {
  constructor(reason: string) {
    super(`Failed to delete image: ${reason}`);
    this.name = 'ImageDeletionFailedException';
  }
}
