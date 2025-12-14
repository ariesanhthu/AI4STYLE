import { useState } from "react";
import { GetListImageResponse } from "../types/images.type";

export function useImageSelection(images: GetListImageResponse['items']) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map(img => img.id)));
    }
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  }

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
    setSelectedIds // Expose setter if needed for manual updates
  };
}
