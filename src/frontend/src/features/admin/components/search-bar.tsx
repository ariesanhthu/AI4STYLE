"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  /**
   * Callback fired when search value changes (debounced)
   */
  onSearch: (value: string) => void;
  
  /**
   * Placeholder text for the input
   * @default "Search..."
   */
  placeholder?: string;
  
  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceDelay?: number;
  
  /**
   * Initial value for the search input
   */
  defaultValue?: string;
  
  /**
   * Callback fired on every keystroke (immediate, not debounced)
   * Use this if you need real-time access to the search value
   */
  onChange?: (value: string) => void;
  
  /**
   * Additional class name for the container
   */
  className?: string;
  
  /**
   * Disable the search input
   */
  disabled?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = "Search...",
  debounceDelay = 300,
  defaultValue = "",
  onChange,
  className,
  disabled = false,
}: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue);
  const debounceTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const handleChange = (newValue: string) => {
    // Update internal state immediately
    setValue(newValue);

    // Call immediate onChange if provided
    if (onChange) {
      onChange(newValue);
    }

    // Debounce the search callback
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(newValue);
    }, debounceDelay);
  };

  const handleClear = () => {
    handleChange("");
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className="pl-9 pr-9"
      />
      
      {value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 h-7 w-7"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
