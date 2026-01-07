"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../core/user/exceptions");
let UserExceptionFilter = class UserExceptionFilter {
    catch(exception, host) {
        let status = common_1.HttpStatus.BAD_REQUEST;
        switch (exception.constructor) {
            case exceptions_1.UserNotFoundException:
                status = common_1.HttpStatus.NOT_FOUND;
                break;
            case exceptions_1.UserAlreadyExistsException:
            case exceptions_1.RootAdminCannotBeDeletedException:
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
exports.UserExceptionFilter = UserExceptionFilter;
exports.UserExceptionFilter = UserExceptionFilter = __decorate([
    (0, common_1.Catch)(exceptions_1.UserException)
], UserExceptionFilter);
//# sourceMappingURL=user.filter.js.map