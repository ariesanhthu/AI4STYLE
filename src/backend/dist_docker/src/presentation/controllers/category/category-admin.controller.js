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
exports.CategoryAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../application/category/dtos");
const base_category_controller_1 = require("./base-category.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_2 = require("../../../shared/dtos");
const services_1 = require("../../../application/category/services");
let CategoryAdminController = class CategoryAdminController extends base_category_controller_1.BaseCategoryController {
    categoryService;
    constructor(categoryService) {
        super(categoryService);
        this.categoryService = categoryService;
    }
    createCategory(createCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }
    getAllCategories(query) {
        return this.categoryService.getListCategory(query);
    }
    updateCategory(id, updateCategoryDto) {
        return this.categoryService.updateCategory(id, updateCategoryDto);
    }
    deleteCategory(id) {
        return this.categoryService.deleteCategory(id);
    }
};
exports.CategoryAdminController = CategoryAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.categoryResponseSchema,
        description: 'Category created successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category' }),
    (0, decorators_1.ApiZodBody)(dtos_1.createCategorySchema),
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.createCategorySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryAdminController.prototype, "createCategory", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.baseCategoryResponseSchema),
        description: 'Categories retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all categories with filtering and pagination',
    }),
    (0, decorators_1.ApiZodQuery)(dtos_2.paginationCursorQuerySchema),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_2.paginationCursorQuerySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryAdminController.prototype, "getAllCategories", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.categoryResponseSchema,
        description: 'Category updated successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category by ID' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateCategorySchema),
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateCategorySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CategoryAdminController.prototype, "updateCategory", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Category deleted successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category by ID' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoryAdminController.prototype, "deleteCategory", null);
exports.CategoryAdminController = CategoryAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.CATEGORY}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.CATEGORY_MANAGEMENT),
    (0, common_1.Controller)('admin/category'),
    __metadata("design:paramtypes", [services_1.CategoryService])
], CategoryAdminController);
//# sourceMappingURL=category-admin.controller.js.map