import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOrder } from "../types/filter";

interface SortDropdownProps {
  sortOrder?: SortOrder;
  onSortChange: (value: SortOrder) => void;
}

export function SortDropdown({ sortOrder, onSortChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sắp xếp theo:</span>
      <Select
        value={sortOrder}
        onValueChange={(value) => onSortChange(value as SortOrder)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mặc định" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Giá: Thấp đến Cao</SelectItem>
          <SelectItem value="desc">Giá: Cao đến Thấp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
