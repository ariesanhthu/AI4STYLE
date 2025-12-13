import { useState } from "react";

export type ViewMode = "grid" | "list";

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  return { viewMode, toggleViewMode };
}
