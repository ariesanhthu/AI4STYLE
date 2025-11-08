export class ImageEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public url: string,
    public format: string,
    public size: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

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
