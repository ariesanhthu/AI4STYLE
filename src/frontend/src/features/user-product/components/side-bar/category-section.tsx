import { Category } from "../../types/category";
import { ChevronRight } from "lucide-react";
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
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Danh mục</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.categoryId} className="space-y-1">
            <button
              onClick={() => onSelectCategory(category.categoryId)}
              className={cn(
                "flex w-full items-center justify-between text-sm hover:text-brand-primary",
                selectedCategories.includes(category.categoryId)
                  ? "font-medium text-brand-primary"
                  : "text-gray-600"
              )}
            >
              <span>{category.name}</span>
              {category.childrens && category.childrens.length > 0 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {category.childrens && category.childrens.length > 0 && (
              <div className="ml-4 space-y-1 border-l pl-4">
                {category.childrens.map((child) => (
                  <button
                    key={child.categoryId}
                    onClick={() => onSelectCategory(child.categoryId)}
                    className={cn(
                      "block w-full text-left text-sm hover:text-brand-primary",
                      selectedCategories.includes(child.categoryId)
                        ? "font-medium text-brand-primary"
                        : "text-gray-500"
                    )}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
