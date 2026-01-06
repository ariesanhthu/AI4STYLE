"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon, Trash2, Upload } from "lucide-react";
import { ImageUploadForm } from "./image-upload-form";
import { ImageList } from "./image-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useImageList } from "../hooks/use-image-list";
import { useImageSelection } from "../hooks/use-image-selection";
import { useViewMode } from "../hooks/use-view-mode";
import { useImageActions } from "../hooks/use-image-actions";

export function AdminImagesStoragePage() {
  // 1. Data & Pagination
  const {
    images, loading, error, hasNextPage, hasPrevPage,
    fetchImages, handleNextPage, handlePrevPage, refresh, resetToFirstPage
  } = useImageList();

  // 2. View Mode
  const { viewMode, toggleViewMode } = useViewMode();

  // 3. Selection
  const { selectedIds, toggleSelection, selectAll, clearSelection } = useImageSelection(images);

  // 4. Actions
  const { handleDelete, handleBulkDelete, handleUpload } = useImageActions({
    refresh,
    resetToFirstPage,
    clearSelection
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const onUploadSuccess = async (files: File[]) => {
    await handleUpload(files);
    setIsUploadOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Kho ảnh</h1>
        <div className="flex items-center gap-4">
          {selectedIds.size > 0 && (
            <Button variant="destructive" size="lg" onClick={() => handleBulkDelete(selectedIds)}>
              <Trash2 className="mr-2 h-5 w-5" />
              Xóa ({selectedIds.size})
            </Button>
          )}

          <div className="flex items-center gap-2">
            {/* View Toggle Buttons */}
            <div className="flex items-center border rounded-md bg-background shadow-sm">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="lg"
                className="rounded-none rounded-l-md px-4"
                onClick={() => viewMode !== "grid" && toggleViewMode()}
                title="Xem lưới"
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="lg"
                className="rounded-none rounded-r-md px-4"
                onClick={() => viewMode !== "list" && toggleViewMode()}
                title="Xem danh sách"
              >
                <ListIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Tải ảnh lên
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Tải ảnh lên</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <ImageUploadForm onUpload={onUploadSuccess} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="border rounded-lg bg-card text-card-foreground shadow-sm p-4">
        {error && (
          <div className="text-destructive mb-4 text-sm">{error}</div>
        )}

        <ImageList
          images={images}
          loading={loading}
          viewMode={viewMode}
          selectedIds={selectedIds}
          onSelect={toggleSelection}
          onSelectAll={selectAll}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-center space-x-2 py-4 border-t mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={!hasPrevPage || loading}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={!hasNextPage || loading}
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
}
