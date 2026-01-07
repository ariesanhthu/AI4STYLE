"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../core/category/exceptions");
let CategoryExceptionFilter = class CategoryExceptionFilter {
    catch(exception, host) {
        let status = common_1.HttpStatus.BAD_REQUEST;
        switch (exception.constructor) {
            case exceptions_1.CategoryNotFoundException:
                status = common_1.HttpStatus.NOT_FOUND;
                break;
            case exceptions_1.CategorySlugAlreadyExistsException:
            case exceptions_1.CategoryCircularReferenceException:
            case exceptions_1.CategoryHasChildrenException:
            case exceptions_1.CategoryHasProductsException:
            case exceptions_1.CategoryNameAlreadyExistsException:
                status = common_1.HttpStatus.BAD_REQUEST;
                break;
            default:
                status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            throw exception;
        }
        const exceptionResponse = {
            name: exception.name,
            message: exception.message,
        };
        throw new common_1.HttpException(exceptionResponse, status);
    }
};
exports.CategoryExceptionFilter = CategoryExceptionFilter;
exports.CategoryExceptionFilter = CategoryExceptionFilter = __decorate([
    (0, common_1.Catch)(exceptions_1.CategoryException)
], CategoryExceptionFilter);
//# sourceMappingURL=category.filter.js.map