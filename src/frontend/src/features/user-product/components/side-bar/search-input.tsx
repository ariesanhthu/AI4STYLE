import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface SearchInputProps {
  defaultValue?: string;
  onSearch: (value: string) => void;
}

export function SearchInput({ defaultValue = "", onSearch }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      onSearch(value);
    }
  };

  const handleSearchClick = () => {
    onSearch(value);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">Tìm kiếm</h3>
      <div className="relative">
        <button
          onClick={handleSearchClick}
          className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Search className="h-4 w-4" />
        </button>
        <Input
          type="search"
          placeholder="Tìm sản phẩm..."
          className="pl-9"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
      </div>
    </div>
  );
}
