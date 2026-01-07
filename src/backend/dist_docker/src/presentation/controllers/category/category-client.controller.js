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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryClientController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_category_controller_1 = require("./base-category.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../shared/dtos");
const services_1 = require("../../../application/category/services");
let CategoryClientController = class CategoryClientController extends base_category_controller_1.BaseCategoryController {
    categoryService;
    constructor(categoryService) {
        super(categoryService);
        this.categoryService = categoryService;
    }
};
exports.CategoryClientController = CategoryClientController;
exports.CategoryClientController = CategoryClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.CATEGORY}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_1.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.CATEGORY_MANAGEMENT),
    (0, common_1.Controller)('client/category'),
    __metadata("design:paramtypes", [services_1.CategoryService])
], CategoryClientController);
//# sourceMappingURL=category-client.controller.js.map