import { X } from "lucide-react";
import { FilterOptions } from "../../types/filter";
import { Category } from "../../types/category";
import { COLORS } from "./color-filter";

interface ActiveFiltersProps {
  filters: FilterOptions;
  categories: Category[];
  onRemoveFilter: (key: keyof FilterOptions, value?: unknown) => void;
  onClearAll: () => void;
  onClearPrice: () => void;
}

export function ActiveFilters({
  filters,
  categories,
  onRemoveFilter,
  onClearAll,
  onClearPrice,
}: ActiveFiltersProps) {
  const hasFilters =
    (filters.categoryId && filters.categoryId.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.colorFamily && filters.colorFamily.length > 0) ||
    (filters.search && filters.search.length > 0);

  if (!hasFilters) return null;

  const getCategoryName = (id: string) => {
    // Helper function to find category name deeply
    const findCategory = (cats: Category[]): string | undefined => {
      for (const cat of cats) {
        if (cat.categoryId === id) return cat.name;
        if (cat.childrens) {
          const found = findCategory(cat.childrens);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findCategory(categories) || id;
  };

  const getColorName = (code: string) => {
    const color = COLORS.find((c) => c.value === code);
    return color ? color.name : code;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Đang lọc</h3>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-600 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        {filters.search && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Tìm kiếm: {filters.search}
            <button
              onClick={() => onRemoveFilter("search")}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Categories */}
        {filters.categoryId?.map((id) => (
          <span
            key={id}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
          >
            {getCategoryName(id)}
            <button
              onClick={() => onRemoveFilter("categoryId", id)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Price */}
        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Giá: {filters.minPrice ? filters.minPrice.toLocaleString() : "0"} -{" "}
            {filters.maxPrice ? filters.maxPrice.toLocaleString() : "Max"}
            <button
              onClick={onClearPrice}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Colors */}
        {filters.colorFamily?.map((color) => (
          <span
            key={color}
            className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
          >
            Màu: {getColorName(color)}
            <button
              onClick={() => onRemoveFilter("colorFamily", color)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
