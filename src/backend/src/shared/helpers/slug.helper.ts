/**
 * Slug Builder Helper
 * Converts text into URL-friendly slugs
 */

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to convert to slug
 * @param options - Optional configuration
 * @returns URL-friendly slug
 * 
 * @example
 * buildSlug("Hello World!") // "hello-world"
 * buildSlug("Áo Thun Nam") // "ao-thun-nam"
 * buildSlug("T-Shirt   Blue") // "t-shirt-blue"
 */
export function buildSlug(
  text: string,
  options?: {
    separator?: string;
    lowercase?: boolean;
    maxLength?: number;
  }
): string {
  const { separator = '-', lowercase = true, maxLength = 200 } = options || {};

  let slug = text.trim();

  // Convert to lowercase if specified
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Remove Vietnamese accents
  slug = removeVietnameseAccents(slug);

  // Remove special characters except alphanumeric, spaces, and hyphens
  slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');

  // Replace multiple spaces or hyphens with single separator
  slug = slug.replace(/[\s-]+/g, separator);

  // Remove leading and trailing separators
  slug = slug.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  // Limit length if specified
  if (maxLength && slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    // Remove trailing separator after truncation
    slug = slug.replace(new RegExp(`${separator}+$`, 'g'), '');
  }

  return slug;
}

/**
 * Generate a unique slug by appending a suffix if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 * 
 * @example
 * buildUniqueSlug("product", ["product", "product-1"]) // "product-2"
 */
export function buildUniqueSlug(
  baseSlug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Build product slug from name and color
 * @param name - Product name
 * @param color - Product color
 * @returns Product slug
 * 
 * @example
 * buildProductSlug("Classic T-Shirt", "Navy Blue") // "classic-t-shirt-navy-blue"
 */
export function buildProductSlug(name: string, color: string): string {
  const combinedText = `${name} ${color}`;
  return buildSlug(combinedText);
}

/**
 * Remove Vietnamese accents from text
 */
function removeVietnameseAccents(text: string): string {
  const accentsMap: Record<string, string> = {
    à: 'a', á: 'a', ả: 'a', ã: 'a', ạ: 'a',
    ă: 'a', ằ: 'a', ắ: 'a', ẳ: 'a', ẵ: 'a', ặ: 'a',
    â: 'a', ầ: 'a', ấ: 'a', ẩ: 'a', ẫ: 'a', ậ: 'a',
    đ: 'd',
    è: 'e', é: 'e', ẻ: 'e', ẽ: 'e', ẹ: 'e',
    ê: 'e', ề: 'e', ế: 'e', ể: 'e', ễ: 'e', ệ: 'e',
    ì: 'i', í: 'i', ỉ: 'i', ĩ: 'i', ị: 'i',
    ò: 'o', ó: 'o', ỏ: 'o', õ: 'o', ọ: 'o',
    ô: 'o', ồ: 'o', ố: 'o', ổ: 'o', ỗ: 'o', ộ: 'o',
    ơ: 'o', ờ: 'o', ớ: 'o', ở: 'o', ỡ: 'o', ợ: 'o',
    ù: 'u', ú: 'u', ủ: 'u', ũ: 'u', ụ: 'u',
    ư: 'u', ừ: 'u', ứ: 'u', ử: 'u', ữ: 'u', ự: 'u',
    ỳ: 'y', ý: 'y', ỷ: 'y', ỹ: 'y', ỵ: 'y',
    À: 'A', Á: 'A', Ả: 'A', Ã: 'A', Ạ: 'A',
    Ă: 'A', Ằ: 'A', Ắ: 'A', Ẳ: 'A', Ẵ: 'A', Ặ: 'A',
    Â: 'A', Ầ: 'A', Ấ: 'A', Ẩ: 'A', Ẫ: 'A', Ậ: 'A',
    Đ: 'D',
    È: 'E', É: 'E', Ẻ: 'E', Ẽ: 'E', Ẹ: 'E',
    Ê: 'E', Ề: 'E', Ế: 'E', Ể: 'E', Ễ: 'E', Ệ: 'E',
    Ì: 'I', Í: 'I', Ỉ: 'I', Ĩ: 'I', Ị: 'I',
    Ò: 'O', Ó: 'O', Ỏ: 'O', Õ: 'O', Ọ: 'O',
    Ô: 'O', Ồ: 'O', Ố: 'O', Ổ: 'O', Ỗ: 'O', Ộ: 'O',
    Ơ: 'O', Ờ: 'O', Ớ: 'O', Ở: 'O', Ỡ: 'O', Ợ: 'O',
    Ù: 'U', Ú: 'U', Ủ: 'U', Ũ: 'U', Ụ: 'U',
    Ư: 'U', Ừ: 'U', Ứ: 'U', Ử: 'U', Ữ: 'U', Ự: 'U',
    Ỳ: 'Y', Ý: 'Y', Ỷ: 'Y', Ỹ: 'Y', Ỵ: 'Y',
  };

  return text.split('').map(char => accentsMap[char] || char).join('');
}
