export class CategoryEntity {
  constructor(
    public readonly categoryId: string,
    public parentId: string | null,
    public name: string,
    public slug: string,
    public icon: string | null,
    public description: string | null,
    public search: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public parent?: CategoryEntity | null,
  ) {}

  toJSON() {
    return {
      categoryId: this.categoryId,
      parentId: this.parentId,
      name: this.name,
      slug: this.slug,
      icon: this.icon,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      parent: this.parent ? this.parent.toJSON() : undefined,
    };
  }
}
