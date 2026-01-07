"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchString = buildSearchString;
exports.buildProductSearch = buildProductSearch;
exports.buildCategorySearch = buildCategorySearch;
exports.matchesSearch = matchesSearch;
function buildSearchString(...fields) {
    const validFields = fields.filter((field) => field !== null && field !== undefined && field.trim() !== '');
    if (validFields.length === 0) {
        return '';
    }
    let searchText = validFields.join(' ');
    searchText = searchText.toLowerCase();
    searchText = removeVietnameseAccents(searchText);
    searchText = searchText.replace(/[^a-z0-9\s]/g, ' ');
    searchText = searchText.replace(/\s+/g, ' ');
    searchText = searchText.trim();
    return searchText;
}
function buildProductSearch(name, description) {
    return buildSearchString(name, description);
}
function buildCategorySearch(name, description) {
    return buildSearchString(name, description);
}
function matchesSearch(searchText, query) {
    if (!query || !searchText) {
        return false;
    }
    const normalizedQuery = buildSearchString(query);
    const queryWords = normalizedQuery
        .split(' ')
        .filter((word) => word.length > 0);
    return queryWords.every((word) => searchText.includes(word));
}
function removeVietnameseAccents(text) {
    const accentsMap = {
        à: 'a',
        á: 'a',
        ả: 'a',
        ã: 'a',
        ạ: 'a',
        ă: 'a',
        ằ: 'a',
        ắ: 'a',
        ẳ: 'a',
        ẵ: 'a',
        ặ: 'a',
        â: 'a',
        ầ: 'a',
        ấ: 'a',
        ẩ: 'a',
        ẫ: 'a',
        ậ: 'a',
        đ: 'd',
        è: 'e',
        é: 'e',
        ẻ: 'e',
        ẽ: 'e',
        ẹ: 'e',
        ê: 'e',
        ề: 'e',
        ế: 'e',
        ể: 'e',
        ễ: 'e',
        ệ: 'e',
        ì: 'i',
        í: 'i',
        ỉ: 'i',
        ĩ: 'i',
        ị: 'i',
        ò: 'o',
        ó: 'o',
        ỏ: 'o',
        õ: 'o',
        ọ: 'o',
        ô: 'o',
        ồ: 'o',
        ố: 'o',
        ổ: 'o',
        ỗ: 'o',
        ộ: 'o',
        ơ: 'o',
        ờ: 'o',
        ớ: 'o',
        ở: 'o',
        ỡ: 'o',
        ợ: 'o',
        ù: 'u',
        ú: 'u',
        ủ: 'u',
        ũ: 'u',
        ụ: 'u',
        ư: 'u',
        ừ: 'u',
        ứ: 'u',
        ử: 'u',
        ữ: 'u',
        ự: 'u',
        ỳ: 'y',
        ý: 'y',
        ỷ: 'y',
        ỹ: 'y',
        ỵ: 'y',
        À: 'a',
        Á: 'a',
        Ả: 'a',
        Ã: 'a',
        Ạ: 'a',
        Ă: 'a',
        Ằ: 'a',
        Ắ: 'a',
        Ẳ: 'a',
        Ẵ: 'a',
        Ặ: 'a',
        Â: 'a',
        Ầ: 'a',
        Ấ: 'a',
        Ẩ: 'a',
        Ẫ: 'a',
        Ậ: 'a',
        Đ: 'd',
        È: 'e',
        É: 'e',
        Ẻ: 'e',
        Ẽ: 'e',
        Ẹ: 'e',
        Ê: 'e',
        Ề: 'e',
        Ế: 'e',
        Ể: 'e',
        Ễ: 'e',
        Ệ: 'e',
        Ì: 'i',
        Í: 'i',
        Ỉ: 'i',
        Ĩ: 'i',
        Ị: 'i',
        Ò: 'o',
        Ó: 'o',
        Ỏ: 'o',
        Õ: 'o',
        Ọ: 'o',
        Ô: 'o',
        Ồ: 'o',
        Ố: 'o',
        Ổ: 'o',
        Ỗ: 'o',
        Ộ: 'o',
        Ơ: 'o',
        Ờ: 'o',
        Ớ: 'o',
        Ở: 'o',
        Ỡ: 'o',
        Ợ: 'o',
        Ù: 'u',
        Ú: 'u',
        Ủ: 'u',
        Ũ: 'u',
        Ụ: 'u',
        Ư: 'u',
        Ừ: 'u',
        Ứ: 'u',
        Ử: 'u',
        Ữ: 'u',
        Ự: 'u',
        Ỳ: 'y',
        Ý: 'y',
        Ỷ: 'y',
        Ỹ: 'y',
        Ỵ: 'y',
    };
    return text
        .split('')
        .map((char) => accentsMap[char] || char)
        .join('');
}
//# sourceMappingURL=search.helper.js.map