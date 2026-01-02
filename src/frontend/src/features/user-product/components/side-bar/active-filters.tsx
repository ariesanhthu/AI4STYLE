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
    filters.category_id ||
    filters.min_price !== undefined ||
    filters.max_price !== undefined ||
    filters.color_family ||
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
        {filters.category_id && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {getCategoryName(filters.category_id)}
            <button
              onClick={() => onRemoveFilter("category_id")}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Price */}
        {(filters.min_price !== undefined ||
          filters.max_price !== undefined) && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Giá:{" "}
            {filters.min_price
              ? Number(filters.min_price).toLocaleString()
              : "0"}{" "}
            -{" "}
            {filters.max_price
              ? Number(filters.max_price).toLocaleString()
              : "Max"}
            <button
              onClick={onClearPrice}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Colors */}
        {filters.color_family && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Màu: {getColorName(filters.color_family)}
            <button
              onClick={() => onRemoveFilter("color_family")}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
