import { FilterOptions } from "../../types/filter";
import { Category } from "../../types/category";
import { CategorySection } from "./category-section";
import { PriceRangeSlider } from "./price-range-slider";
import { ActiveFilters } from "./active-filters";

import { ColorFilter } from "./color-filter";
import { SearchInput } from "./search-input";

const MIN_PRICE = 0;
const MAX_PRICE = 5000000;

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
    // Single select toggle
    onUpdateFilters({
      category_id: filters.category_id === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    if (value[0] === MIN_PRICE && value[1] === MAX_PRICE) {
      onUpdateFilters({
        min_price: undefined,
        max_price: undefined,
      });
    } else {
      onUpdateFilters({
        min_price: value[0].toString(),
        max_price: value[1].toString(),
      });
    }
  };

  const handleRemoveFilter = (key: keyof FilterOptions) => {
    if (key === "category_id") {
      onUpdateFilters({ category_id: undefined });
    } else if (key === "color_family") {
      onUpdateFilters({ color_family: undefined });
    } else {
      onUpdateFilters({ [key]: undefined });
    }
  };

  const handleClearPrice = () => {
    onUpdateFilters({ min_price: undefined, max_price: undefined });
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
        selectedCategories={filters.category_id ? [filters.category_id] : []}
        onSelectCategory={handleCategorySelect}
      />
      <PriceRangeSlider
        min={MIN_PRICE}
        max={MAX_PRICE}
        value={[
          Number(filters.min_price) || MIN_PRICE,
          Number(filters.max_price) || MAX_PRICE,
        ]}
        onChange={handlePriceChange}
      />
      <ColorFilter
        selectedColor={filters.color_family}
        onSelect={(color) =>
          onUpdateFilters({
            color_family: filters.color_family === color ? undefined : color,
          })
        }
      />
    </div>
  );
}
