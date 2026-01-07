"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestSellerSchema = void 0;
const pagination_cursor_dto_1 = require("../../../shared/dtos/pagination-cursor.dto");
exports.getBestSellerSchema = pagination_cursor_dto_1.paginationCursorQuerySchema.omit({
    sortOrder: true,
});
//# sourceMappingURL=get-best-seller.dto.js.map