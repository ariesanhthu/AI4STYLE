import { useState, useCallback, useRef } from "react";
import { imageService } from "../services/images.service";
import { GetListImageResponse } from "../types/images.type";

export function useImageList() {
  const [images, setImages] = useState<GetListImageResponse['items']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [nextCursor, setNextCursor] = useState<string | undefined | null>(undefined);
  const cursorStackRef = useRef<string[]>([]);
  const currentCursorRef = useRef<string | undefined>(undefined);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchImages = useCallback(async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await imageService.getListImages({
        limit: "16",
        cursor,
      });
      console.log("Fetched images:", data.items);
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

  const refresh = () => {
    fetchImages(currentCursorRef.current);
  }

  const resetToFirstPage = () => {
    cursorStackRef.current = [];
    currentCursorRef.current = undefined;
    setHasPrevPage(false);
    fetchImages();
  }

  return {
    images,
    loading,
    error,
    hasNextPage: !!nextCursor,
    hasPrevPage,
    fetchImages,
    handleNextPage,
    handlePrevPage,
    refresh,
    resetToFirstPage
  };
}
