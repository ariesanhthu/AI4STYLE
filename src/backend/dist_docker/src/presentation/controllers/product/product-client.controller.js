"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductClientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("../../../application/product/services/product.service");
const base_product_controller_1 = require("./base-product.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../application/product/dtos");
const dtos_2 = require("../../../shared/dtos");
let ProductClientController = class ProductClientController extends base_product_controller_1.BaseProductController {
    productService;
    constructor(productService) {
        super(productService);
        this.productService = productService;
    }
    getAllProductOptions(query) {
        return this.productService.getAllProductOptions(query);
    }
    getProductOptionById(id) {
        return this.productService.getProductOptionById(id);
    }
    getBestSellers(query) {
        return this.productService.getBestSellers(query);
    }
};
exports.ProductClientController = ProductClientController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.productOptionResponseSchema),
        description: 'Product options retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all product options with filtering and pagination',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListProductClientSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Get)('options'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListProductClientSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductClientController.prototype, "getAllProductOptions", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.productOptionResponseSchema,
        description: 'Product option retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get product option by ID' }),
    (0, decorators_1.Public)(),
    (0, common_1.Get)('options/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductClientController.prototype, "getProductOptionById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.productOptionBestSellerSchema),
        description: 'Best seller products retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get best seller products' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getBestSellerSchema),
    (0, decorators_1.Public)(),
    (0, common_1.Get)('best-sellers'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getBestSellerSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductClientController.prototype, "getBestSellers", null);
exports.ProductClientController = ProductClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.PRODUCT}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('client/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductClientController);
//# sourceMappingURL=product-client.controller.js.map