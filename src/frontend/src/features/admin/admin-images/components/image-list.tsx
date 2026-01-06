"use client";

import { useImages } from "../hooks/use-images";
import { ImageItem } from "./image-item";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface ImageListProps {
  images: ReturnType<typeof useImages>['images']; // Infer type or import generic interface
  loading: boolean;
  viewMode: ReturnType<typeof useImages>['viewMode'];
  selectedIds: ReturnType<typeof useImages>['selectedIds'];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => void;
}

export function ImageList({ images, loading, viewMode, selectedIds, onSelect, onSelectAll, onDelete }: ImageListProps) {
  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        Không tìm thấy ảnh nào. Hãy tải ảnh lên để bắt đầu.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b">
        <Checkbox
          checked={images.length > 0 && selectedIds.size === images.length}
          onCheckedChange={onSelectAll}
          id="select-all"
        />
        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
          Chọn tất cả
        </label>
        <div className="text-sm text-muted-foreground ml-auto">
          {selectedIds.size} đã chọn
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              viewMode="grid"
              isSelected={selectedIds.has(image.id)}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              viewMode="list"
              isSelected={selectedIds.has(image.id)}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
