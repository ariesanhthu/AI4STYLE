"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productOptionBestSellerSchema = void 0;
const zod_1 = require("zod");
const product_response_dto_1 = require("./product-response.dto");
exports.productOptionBestSellerSchema = product_response_dto_1.productOptionResponseSchema.extend({
    totalSold: zod_1.z.number(),
});
//# sourceMappingURL=product-option-best-seller.dto.js.map