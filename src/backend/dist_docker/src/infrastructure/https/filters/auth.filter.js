"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../../../core/auth/exceptions");
let AuthExceptionFilter = class AuthExceptionFilter {
    catch(exception, host) {
        let status = common_1.HttpStatus.BAD_REQUEST;
        switch (exception.constructor) {
            case exceptions_1.EmailAlreadyRegisteredException:
            case exceptions_1.InvalidCredentialsException:
            case exceptions_1.InvalidOtpException:
            case exceptions_1.InvalidRefreshTokenException:
            case exceptions_1.OldPasswordIncorrectException:
                status = common_1.HttpStatus.BAD_REQUEST;
                break;
            case exceptions_1.UserNotFoundException:
            case exceptions_1.RoleNotFoundException:
                status = common_1.HttpStatus.NOT_FOUND;
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
exports.AuthExceptionFilter = AuthExceptionFilter;
exports.AuthExceptionFilter = AuthExceptionFilter = __decorate([
    (0, common_1.Catch)(exceptions_1.AuthException)
], AuthExceptionFilter);
//# sourceMappingURL=auth.filter.js.map