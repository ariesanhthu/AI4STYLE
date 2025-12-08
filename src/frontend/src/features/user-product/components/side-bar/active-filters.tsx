import { X } from "lucide-react";
import { FilterOptions } from "../../types/filter";
import { Category } from "../../types/category";

interface ActiveFiltersProps {
  filters: FilterOptions;
  categories: Category[];
  onRemoveFilter: (key: keyof FilterOptions, value?: unknown) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  categories,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters =
    (filters.categoryId && filters.categoryId.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.colorFamily && filters.colorFamily.length > 0);

  if (!hasFilters) return null;

  const getCategoryName = (id: string) => {
    for (const cat of categories) {
      if (cat.categoryId === id) return cat.name;
      const child = cat.childrens?.find((c) => c.categoryId === id);
      if (child) return child.name;
    }
    return id;
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
        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Giá: {filters.minPrice ? filters.minPrice / 1000 + "k" : "0"} -{" "}
            {filters.maxPrice ? filters.maxPrice / 1000 + "k" : "Max"}
            <button
              onClick={() => {
                onRemoveFilter("minPrice");
                onRemoveFilter("maxPrice");
              }}
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
