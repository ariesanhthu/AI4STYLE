/**
 * Convert image URL to File object.
 * 
 * Args:
 *   url: string - Image URL to convert
 *   filename?: string - Optional filename for the File object
 * 
 * Returns:
 *   Promise<File> - File object created from the image URL
 * 
 * Raises:
 *   Error - If fetch or conversion fails
 */
export async function urlToFile(url: string, filename?: string): Promise<File> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const file = new File([blob], filename || "image.jpg", { type: blob.type });
    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw error;
  }
}

/**
 * Create preview URL from File or Blob.
 * 
 * Args:
 *   file: File | Blob - File or Blob to create preview from
 * 
 * Returns:
 *   string - Object URL for preview
 */
export function createPreviewUrl(file: File | Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke preview URL to free memory.
 * 
 * Args:
 *   url: string - Object URL to revoke
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

