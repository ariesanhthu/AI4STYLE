export declare class ImageEntity {
    readonly id: string;
    title: string;
    url: string;
    format: string;
    size: number;
    readonly createdAt: Date;
    updatedAt: Date;
    constructor(id: string, title: string, url: string, format: string, size: number, createdAt: Date, updatedAt: Date);
    toJSON(): {
        id: string;
        title: string;
        url: string;
        format: string;
        size: number;
        createdAt: Date;
        updatedAt: Date;
    };
}
