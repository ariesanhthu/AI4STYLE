import { FilterOptions } from "../../types/filter";
import { Category } from "../../types/category";
import { CategorySection } from "./category-section";
import { PriceRangeSlider } from "./price-range-slider";
import { ActiveFilters } from "./active-filters";

import { ColorFilter } from "./color-filter";
import { SearchInput } from "./search-input";

interface ProductsSidebarProps {
  categories: Category[];
  filters: FilterOptions;
  onUpdateFilters: (newFilters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export function ProductsSidebar({
  categories,
  filters,
  onUpdateFilters,
  onClearFilters,
}: ProductsSidebarProps) {
  const handleCategorySelect = (categoryId: string) => {
    const currentCategories = filters.categoryId || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];
    onUpdateFilters({ categoryId: newCategories });
  };

  const handlePriceChange = (value: [number, number]) => {
    onUpdateFilters({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleRemoveFilter = (key: keyof FilterOptions, value?: unknown) => {
    if (key === "categoryId" && value) {
      const currentCategories = filters.categoryId || [];
      onUpdateFilters({
        categoryId: currentCategories.filter((id) => id !== value),
      });
    } else {
      onUpdateFilters({ [key]: undefined });
    }
  };

  const handleClearPrice = () => {
    onUpdateFilters({ minPrice: undefined, maxPrice: undefined });
  };

  return (
    <div className="space-y-8">
      <SearchInput
        defaultValue={filters.search}
        onSearch={(value) => onUpdateFilters({ search: value })}
      />
      <ActiveFilters
        filters={filters}
        categories={categories}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={onClearFilters}
        onClearPrice={handleClearPrice}
      />
      <CategorySection
        categories={categories}
        selectedCategories={filters.categoryId || []}
        onSelectCategory={handleCategorySelect}
      />
      <PriceRangeSlider
        min={0}
        max={5000000}
        value={[filters.minPrice || 0, filters.maxPrice || 5000000]}
        onChange={handlePriceChange}
      />
      <ColorFilter
        selectedColors={filters.colorFamily || []}
        onChange={(colors) => onUpdateFilters({ colorFamily: colors })}
      />
    </div>
  );
}
