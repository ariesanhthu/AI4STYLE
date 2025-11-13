/**
 * Search Builder Helper
 * Builds searchable text from various fields
 */

/**
 * Build search string from text fields
 * Normalizes text for better search results by:
 * - Converting to lowercase
 * - Removing Vietnamese accents
 * - Removing extra whitespace
 * - Removing special characters
 * 
 * @param fields - Array of text fields to include in search
 * @returns Normalized search string
 * 
 * @example
 * buildSearchString(["Áo Thun Nam", "Chất liệu cotton"]) 
 * // "ao thun nam chat lieu cotton"
 */
export function buildSearchString(...fields: (string | null | undefined)[]): string {
  // Filter out null/undefined values
  const validFields = fields.filter((field): field is string => 
    field !== null && field !== undefined && field.trim() !== ''
  );

  if (validFields.length === 0) {
    return '';
  }

  // Combine all fields
  let searchText = validFields.join(' ');

  // Convert to lowercase
  searchText = searchText.toLowerCase();

  // Remove Vietnamese accents
  searchText = removeVietnameseAccents(searchText);

  // Remove special characters but keep spaces
  searchText = searchText.replace(/[^a-z0-9\s]/g, ' ');

  // Replace multiple spaces with single space
  searchText = searchText.replace(/\s+/g, ' ');

  // Trim
  searchText = searchText.trim();

  return searchText;
}

/**
 * Build product search string from name and description
 * @param name - Product name
 * @param description - Product description (optional)
 * @returns Searchable text
 * 
 * @example
 * buildProductSearch("T-Shirt Classic", "100% Cotton fabric")
 * // "t-shirt classic 100% cotton fabric"
 */
export function buildProductSearch(
  name: string,
  description?: string | null
): string {
  return buildSearchString(name, description);
}

/**
 * Build category search string from name and description
 * @param name - Category name
 * @param description - Category description (optional)
 * @returns Searchable text
 */
export function buildCategorySearch(
  name: string,
  description?: string | null
): string {
  return buildSearchString(name, description);
}

/**
 * Check if search query matches search text
 * @param searchText - The indexed search text
 * @param query - User's search query
 * @returns true if matches
 * 
 * @example
 * matchesSearch("ao thun nam", "thun") // true
 * matchesSearch("ao thun nam", "ao nam") // true (both words found)
 */
export function matchesSearch(searchText: string, query: string): boolean {
  if (!query || !searchText) {
    return false;
  }

  const normalizedQuery = buildSearchString(query);
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);

  // Check if all query words are found in search text
  return queryWords.every(word => searchText.includes(word));
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
    À: 'a', Á: 'a', Ả: 'a', Ã: 'a', Ạ: 'a',
    Ă: 'a', Ằ: 'a', Ắ: 'a', Ẳ: 'a', Ẵ: 'a', Ặ: 'a',
    Â: 'a', Ầ: 'a', Ấ: 'a', Ẩ: 'a', Ẫ: 'a', Ậ: 'a',
    Đ: 'd',
    È: 'e', É: 'e', Ẻ: 'e', Ẽ: 'e', Ẹ: 'e',
    Ê: 'e', Ề: 'e', Ế: 'e', Ể: 'e', Ễ: 'e', Ệ: 'e',
    Ì: 'i', Í: 'i', Ỉ: 'i', Ĩ: 'i', Ị: 'i',
    Ò: 'o', Ó: 'o', Ỏ: 'o', Õ: 'o', Ọ: 'o',
    Ô: 'o', Ồ: 'o', Ố: 'o', Ổ: 'o', Ỗ: 'o', Ộ: 'o',
    Ơ: 'o', Ờ: 'o', Ớ: 'o', Ở: 'o', Ỡ: 'o', Ợ: 'o',
    Ù: 'u', Ú: 'u', Ủ: 'u', Ũ: 'u', Ụ: 'u',
    Ư: 'u', Ừ: 'u', Ứ: 'u', Ử: 'u', Ữ: 'u', Ự: 'u',
    Ỳ: 'y', Ý: 'y', Ỷ: 'y', Ỹ: 'y', Ỵ: 'y',
  };

  return text.split('').map(char => accentsMap[char] || char).join('');
}
