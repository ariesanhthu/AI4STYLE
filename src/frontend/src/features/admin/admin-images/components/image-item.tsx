"use client";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Eye } from "lucide-react";
import { toast } from "sonner";
import { GetListImageResponse } from "../types/images.type";
import { ViewMode } from "../hooks/use-images";
import { cn } from "@/lib/utils"; // Assuming utils exist

interface ImageItemProps {
  image: GetListImageResponse['items'][0];
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ImageItem({ image, viewMode, isSelected, onSelect, onDelete }: ImageItemProps) {
  const copyUrl = () => {
    navigator.clipboard.writeText(image.url);
    toast.success("URL copied to clipboard");
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(image.createdAt));

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-3 border-b hover:bg-muted/50 transition-colors group",
          isSelected && "bg-muted/50"
        )}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(image.id)}
        />
        <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden border bg-secondary">
          <Image
            src={image.url}
            alt={image.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate" title={image.title}>{image.title}</h4>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={copyUrl} title="Copy URL">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(image.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className={cn(
        "group relative break-inside-avoid rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all overflow-hidden",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(image.id)}
          className="bg-background/80 backdrop-blur-sm"
        />
      </div>
      <div className="aspect-square relative bg-secondary">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button variant="secondary" size="icon" onClick={copyUrl} title="Copy URL">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => onDelete(image.id)} title="Delete">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm truncate" title={image.title}>{image.title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
      </div>
    </div>
  );
}
