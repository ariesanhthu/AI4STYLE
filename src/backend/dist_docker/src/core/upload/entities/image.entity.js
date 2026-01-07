"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageEntity = void 0;
class ImageEntity {
    id;
    title;
    url;
    format;
    size;
    createdAt;
    updatedAt;
    constructor(id, title, url, format, size, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.format = format;
        this.size = size;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
            format: this.format,
            size: this.size,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.ImageEntity = ImageEntity;
//# sourceMappingURL=image.entity.js.map