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
exports.ProductAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("../../../application/product/services/product.service");
const base_product_controller_1 = require("./base-product.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../application/product/dtos");
const dtos_2 = require("../../../shared/dtos");
let ProductAdminController = class ProductAdminController extends base_product_controller_1.BaseProductController {
    productService;
    constructor(productService) {
        super(productService);
        this.productService = productService;
    }
    getProductById(id, query) {
        return this.productService.getProductById(id, query);
    }
    getAllProducts(query) {
        return this.productService.getAllProducts(query);
    }
    createProduct(createProductDto) {
        return this.productService.createProduct(createProductDto);
    }
    updateProduct(id, updateProductDto) {
        return this.productService.updateProduct(id, updateProductDto);
    }
    updateProductStockPrice(id, updateStockPriceDto) {
        return this.productService.updateProductStockPrice(id, updateStockPriceDto);
    }
    deleteProduct(id) {
        return this.productService.deleteProduct(id);
    }
};
exports.ProductAdminController = ProductAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.productResponseSchema,
        description: 'Product retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getProductByIdQuerySchema),
    (0, decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodQuery)(dtos_1.getProductByIdQuerySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getProductById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.productResponseSchema),
        description: 'Products retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products with filtering and pagination' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListProductSchema),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListProductSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "getAllProducts", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.productResponseSchema,
        description: 'Product created successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product with options and variants' }),
    (0, decorators_1.ApiZodBody)(dtos_1.createProductSchema),
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.createProductSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "createProduct", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.productResponseSchema,
        description: 'Product updated successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update product general information' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateProductSchema),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateProductSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "updateProduct", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Product inventory updated successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update product variants stock and price in bulk' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateProductStockPriceSchema),
    (0, common_1.Patch)(':id/inventory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateProductStockPriceSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "updateProductStockPrice", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Product deleted successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product by ID' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductAdminController.prototype, "deleteProduct", null);
exports.ProductAdminController = ProductAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.PRODUCT}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.PRODUCT_MANAGEMENT),
    (0, common_1.Controller)('admin/product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductAdminController);
//# sourceMappingURL=product-admin.controller.js.map