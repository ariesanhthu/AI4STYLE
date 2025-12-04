export interface Category {
  categoryId: string;
  parentId: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  childrens: Category[];
}
