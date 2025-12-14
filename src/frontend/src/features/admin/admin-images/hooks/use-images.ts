import { useState, useCallback, useRef } from "react";
import { imageService } from "../services/images.service";
import { GetListImageResponse } from "../types/images.type";
import { toast } from "sonner"; // Assuming sonner is used, or generic error handling

export type ViewMode = "grid" | "list";

export function useImages() {
  const [images, setImages] = useState<GetListImageResponse['items']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [nextCursor, setNextCursor] = useState<string | undefined | null>(undefined);
  const cursorStackRef = useRef<string[]>([]);
  const currentCursorRef = useRef<string | undefined>(undefined);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Layout State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchImages = useCallback(async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.getListImages({
        limit: "16", // Requirement: 16 items per page (4x4 or 16 rows)
        cursor,
      });
      setImages(data.items);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNextPage = () => {
    if (nextCursor) {
      cursorStackRef.current.push(currentCursorRef.current || "initial");
      currentCursorRef.current = nextCursor;
      setHasPrevPage(true);
      fetchImages(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (cursorStackRef.current.length > 0) {
      const prevCursor = cursorStackRef.current.pop();
      currentCursorRef.current = prevCursor === "initial" ? undefined : prevCursor;
      setHasPrevPage(cursorStackRef.current.length > 0);
      fetchImages(currentCursorRef.current);
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await imageService.deleteImage(id);
      toast.success("Image deleted successfully");
      fetchImages(currentCursorRef.current); // Refresh current page
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete image");
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} images?`)) return;

    try {
      await imageService.bulkDeleteImages({
        ids: Array.from(selectedIds),
      });
      toast.success("Images deleted successfully");
      fetchImages(currentCursorRef.current);
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete images");
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      // Upload logic will be redundant here if handled in form directly
      // But good to expose a method to refresh list after upload
      await imageService.bulkUploadImages({ files });
      toast.success("Images uploaded successfully");
      // Reset to first page to see new uploads
      cursorStackRef.current = [];
      currentCursorRef.current = undefined;
      setHasPrevPage(false);
      fetchImages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload images");
      throw error; // Let form handle specific error display if needed
    }
  }

  return {
    images,
    loading,
    error,
    viewMode,
    selectedIds,
    hasNextPage: !!nextCursor,
    hasPrevPage,
    fetchImages,
    handleNextPage,
    handlePrevPage,
    toggleViewMode,
    toggleSelection,
    selectAll,
    handleDelete,
    handleBulkDelete,
    handleUpload
  };
}
