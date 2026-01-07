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
exports.BaseCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../application/category/dtos");
class BaseCategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getAllCategoriesInTreeFormat() {
        return this.categoryService.getCategoryTree();
    }
    getCategoryById(id) {
        return this.categoryService.getCategoryById(id);
    }
    getCategoriesBySlug(slug) {
        return this.categoryService.getCategoryBySlug(slug);
    }
}
exports.BaseCategoryController = BaseCategoryController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.categoryTreeResponseSchema,
        description: 'Category tree retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, decorators_1.Public)(),
    (0, common_1.Get)('tree'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseCategoryController.prototype, "getAllCategoriesInTreeFormat", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.categoryResponseSchema,
        description: 'Category retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by ID' }),
    (0, decorators_1.Public)(),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseCategoryController.prototype, "getCategoryById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.categoryResponseSchema,
        description: 'Category retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by slug' }),
    (0, decorators_1.Public)(),
    (0, common_1.Get)('slug/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseCategoryController.prototype, "getCategoriesBySlug", null);
//# sourceMappingURL=base-category.controller.js.map