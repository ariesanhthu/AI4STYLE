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
  sortOption?: SortBy;
  onSortChange: (sort?: { sortOption?: SortBy; sortOrder?: SortOrder }) => void;
}

export function SortDropdown({
  sortOrder,
  sortOption,
  onSortChange,
}: SortDropdownProps) {
  // Determine current value for the select
  const getValue = () => {
    if (!sortOption) return "latest"; // Default
    if (sortOption === "time") {
      return sortOrder === "asc" ? "oldest" : "latest";
    }
    if (sortOption === "price") {
      return sortOrder === "asc" ? "price_asc" : "price_desc";
    }
    return "latest";
  };

  const handleValueChange = (value: string) => {
    switch (value) {
      case "latest":
        onSortChange({ sortOption: "time", sortOrder: "desc" });
        break;
      case "oldest":
        onSortChange({ sortOption: "time", sortOrder: "asc" });
        break;
      case "price_desc":
        onSortChange({ sortOption: "price", sortOrder: "desc" });
        break;
      case "price_asc":
        onSortChange({ sortOption: "price", sortOrder: "asc" });
        break;
      default:
        onSortChange({ sortOption: undefined, sortOrder: undefined });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sắp xếp theo:</span>
      <Select value={getValue()} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Thời gian: Gần đây" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Thời gian: Gần đây</SelectItem>
          <SelectItem value="oldest">Thời gian: Cũ nhất</SelectItem>
          <SelectItem value="price_desc">Giá: Cao đến thấp</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp đến cao</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
