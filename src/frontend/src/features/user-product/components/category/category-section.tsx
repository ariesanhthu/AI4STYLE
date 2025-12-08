"use client";

import CategoryCard from "./category-card";
import type { Category } from "../../types/category";

// Mock categories data
const mockCategories: Category[] = [
  {
    categoryId: "1",
    parentId: "0",
    name: "All",
    slug: "all",
    icon: "",
    description: "All products",
    createdAt: "",
    updatedAt: "",
    childrens: [],
  },
  {
    categoryId: "2",
    parentId: "0",
    name: "Clothing",
    slug: "clothing",
    icon: "",
    description: "Clothing products",
    createdAt: "",
    updatedAt: "",
    childrens: [],
  },
  {
    categoryId: "3",
    parentId: "0",
    name: "Shoes",
    slug: "shoes",
    icon: "",
    description: "Shoes products",
    createdAt: "",
    updatedAt: "",
    childrens: [],
  },
  {
    categoryId: "4",
    parentId: "0",
    name: "Accessories",
    slug: "accessories",
    icon: "",
    description: "Accessories products",
    createdAt: "",
    updatedAt: "",
    childrens: [],
  },
];

const CategorySection = () => {
  return (
    <div className="flex flex-col gap-2">
      {mockCategories.map((category) => (
        <CategoryCard key={category.categoryId} category={category} />
      ))}
    </div>
  );
};

export default CategorySection;
