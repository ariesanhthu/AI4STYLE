import { Category } from "../../types/category";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySection({
  categories,
  selectedCategories,
  onSelectCategory,
}: CategorySectionProps) {
  // Recursive component for category item
  const CategoryItem = ({
    category,
    level = 0,
  }: {
    category: Category;
    level?: number;
  }) => {
    const isSelected = selectedCategories.includes(category.categoryId);
    const hasChildren = category.childrens && category.childrens.length > 0;

    return (
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(category.categoryId)}
          className={cn(
            "flex w-full items-center justify-between text-left text-sm hover:text-brand-primary py-1",
            isSelected ? "font-bold text-brand-primary" : "text-gray-600"
          )}
        >
          <span>{category.name}</span>
        </button>
        {hasChildren && (
          <div className="space-y-1 ml-3 border-l border-gray-200 pl-3 leading-none">
            {category.childrens!.map((child) => (
              <CategoryItem
                key={child.categoryId}
                category={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Danh mục</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <CategoryItem key={category.categoryId} category={category} />
        ))}
      </div>
    </div>
  );
}
