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
var NestLoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestLoggerService = void 0;
const common_1 = require("@nestjs/common");
let NestLoggerService = NestLoggerService_1 = class NestLoggerService {
    logger;
    constructor(context) {
        this.logger = new common_1.Logger(context || NestLoggerService_1.name);
    }
    setContext(context) {
        this.logger = new common_1.Logger(context);
    }
    log(message, context) {
        if (context) {
            this.logger.log(message, context);
        }
        else {
            this.logger.log(message);
        }
    }
    error(message, trace, context) {
        if (context) {
            this.logger.error(message, trace, context);
        }
        else {
            this.logger.error(message, trace);
        }
    }
    warn(message, context) {
        if (context) {
            this.logger.warn(message, context);
        }
        else {
            this.logger.warn(message);
        }
    }
    debug(message, context) {
        if (context) {
            this.logger.debug(message, context);
        }
        else {
            this.logger.debug(message);
        }
    }
    verbose(message, context) {
        if (context) {
            this.logger.verbose(message, context);
        }
        else {
            this.logger.verbose(message);
        }
    }
};
exports.NestLoggerService = NestLoggerService;
exports.NestLoggerService = NestLoggerService = NestLoggerService_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __param(0, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [String])
], NestLoggerService);
//# sourceMappingURL=nest-logger.service.js.map