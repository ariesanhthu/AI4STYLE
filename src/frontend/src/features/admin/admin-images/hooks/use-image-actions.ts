import { toast } from "sonner";
import { imageService } from "../services/images.service";
import { ErrorResponse } from "@/features/auth-management";

interface UseImageActionsProps {
  refresh: () => void;
  resetToFirstPage: () => void;
  clearSelection: () => void;
}

export function useImageActions({ refresh, resetToFirstPage, clearSelection }: UseImageActionsProps) {

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await imageService.deleteImage(id);
      toast.success("Image deleted successfully");
      refresh();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete image");
    }
  };

  const handleBulkDelete = async (selectedIds: Set<string>) => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} images?`)) return;

    try {
      await imageService.bulkDeleteImages({
        ids: Array.from(selectedIds),
      });
      toast.success("Images deleted successfully");
      refresh();
      clearSelection();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete images");
    }
  };

  const handleUpload = async (files: File[]) => {
    try {
      await imageService.bulkUploadImages({ files });
      toast.success("Images uploaded successfully");
      resetToFirstPage();
    } catch (error) {
      if ((error as ErrorResponse).message) {
        toast.error((error as ErrorResponse).message);
      } else {
        toast.error("Failed to upload images");
      }
      console.log(error);
    }
  };

  return {
    handleDelete,
    handleBulkDelete,
    handleUpload
  };
}
