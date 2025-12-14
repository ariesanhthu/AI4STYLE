import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOrder, SortBy } from "../types/filter";

interface SortDropdownProps {
  sortOrder?: SortOrder;
  sortBy?: SortBy; // Added sortBy prop
  onSortChange: (sort?: { sortBy?: SortBy; sortOrder?: SortOrder }) => void;
}

export function SortDropdown({
  sortOrder,
  sortBy,
  onSortChange,
}: SortDropdownProps) {
  // Determine current value for the select
  const getValue = () => {
    if (!sortBy) return "default";
    if (sortBy === "price") {
      return sortOrder === "asc" ? "price_asc" : "price_desc";
    }
    return "default";
  };

  const handleValueChange = (value: string) => {
    if (value === "default") {
      onSortChange({ sortBy: undefined, sortOrder: undefined }); // Clear sort
    } else if (value === "price_asc") {
      onSortChange({ sortBy: "price", sortOrder: "asc" });
    } else if (value === "price_desc") {
      onSortChange({ sortBy: "price", sortOrder: "desc" });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sắp xếp theo:</span>
      <Select value={getValue()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mặc định" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Mặc định</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
          <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
