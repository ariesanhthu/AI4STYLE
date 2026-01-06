"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageList } from "./image-list";
import { ImageUploadForm } from "./image-upload-form";
import { useImageList } from "../hooks/use-image-list";
import { Loader2, Check } from "lucide-react";
import { GetListImageResponse } from "../types/images.type";

interface ImageSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selectedHandler: string[]) => void; // Passing back array of URLs
  multiple?: boolean;
}

export function ImageSelectDialog({ open, onOpenChange, onSelect, multiple = true }: ImageSelectDialogProps) {
  const {
    images, loading, error, hasNextPage, hasPrevPage,
    fetchImages, handleNextPage, handlePrevPage, refresh, resetToFirstPage
  } = useImageList();

  // We track selected *objects* (or at least IDs and Map to objects) to ensure we have the URLs.
  // Since `images` changes on pagination, we need to persist selected items.
  const [selectedItems, setSelectedItems] = useState<Map<string, string>>(new Map()); // Map<ID, URL>

  // Helper to map current page images to a friendly format if needed, 
  // but ImageList expects strict types. 
  // We need to intercept the onSelect from ImageList.

  useEffect(() => {
    if (open) {
      fetchImages();
      // We could optionally clear selection on open, or keep it. 
      // For now, let's keep it empty initially or maybe we want to pass in pre-selected?
      setSelectedItems(new Map());
    }
  }, [open, fetchImages]);

  const handleToggleSelect = (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return; // Should not happen if clicked from list

    setSelectedItems(prev => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        if (!multiple) {
          newMap.clear();
        }
        newMap.set(id, image.url);
      }
      return newMap;
    });
  };

  const handleSelectAll = () => {
    if (!multiple) return;

    // If all on current page are selected, deselect them. Otherwise select all on current page.
    const allCurrentSelected = images.every(img => selectedItems.has(img.id));

    setSelectedItems(prev => {
      const newMap = new Map(prev);
      if (allCurrentSelected) {
        images.forEach(img => newMap.delete(img.id));
      } else {
        images.forEach(img => newMap.set(img.id, img.url));
      }
      return newMap;
    });
  };

  const handleConfirm = () => {
    onSelect(Array.from(selectedItems.values()));
    onOpenChange(false);
  };

  const onUploadSuccess = async (files: File[]) => {
    // After upload, we refresh the list. 
    // Ideally, we would also auto-select the uploaded images, but that requires the upload response to return them.
    // useImageActions' handleUpload returns void but calls bulkUploadImages.
    // The ImageUploadForm calls a prop onUpload. 
    // We can implement a local handleUpload that calls the service directly or uses the hook logic 
    // BUT `ImageUploadForm` expects `onUpload: (files: File[]) => Promise<void>`.

    // Let's rely on refresh for now. User can select them after they appear.
    // Or if we want better UX, we might need to modify ImageUploadForm or the service to return the uploaded images.
    // For this MVP step, refreshing and switching to library tab is acceptable.

    resetToFirstPage();

    // Switch to library view
    setActiveTab("library");
  };

  const [activeTab, setActiveTab] = useState("library");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Select Images</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 border-b">
            <TabsList>
              <TabsTrigger value="library">Library</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col p-0 m-0">
            <div className="flex-1 overflow-y-auto p-6">
              {error && <div className="text-destructive mb-4">{error}</div>}

              <ImageList
                images={images}
                loading={loading}
                viewMode="grid" // Force grid for selection dialog
                selectedIds={new Set(selectedItems.keys())}
                onSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onDelete={() => { }} // Disable delete in selection dialog
              />
            </div>

            {/* Pagination & Footer */}
            <div className="p-4 border-t bg-muted/20 flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={!hasPrevPage || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || loading}
                >
                  Next
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <div className="text-sm text-muted-foreground mr-2">
                  {selectedItems.size} selected
                </div>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button onClick={handleConfirm} disabled={selectedItems.size === 0}>
                  Confirm
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-y-auto p-6 m-0">
            <ImageUploadHelper onUploadSuccess={onUploadSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper wrapper to use existing ImageUploadForm with service
import { imageService } from "../services/images.service";
import { toast } from "sonner";

function ImageUploadHelper({ onUploadSuccess }: { onUploadSuccess: (files: File[]) => Promise<void> }) {
  const handleUpload = async (files: File[]) => {
    try {
      await imageService.bulkUploadImages({ files });
      toast.success("Images uploaded successfully");
      await onUploadSuccess(files);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images");
    }
  };

  return <ImageUploadForm onUpload={handleUpload} />;
}
