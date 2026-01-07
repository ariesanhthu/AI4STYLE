"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerResponseTimeMiddleware = void 0;
const common_1 = require("@nestjs/common");
let LoggerResponseTimeMiddleware = class LoggerResponseTimeMiddleware {
    use(req, res, next) {
        const logger = new common_1.Logger('ResponseTime');
        const startTime = Date.now();
        res.on('finish', () => {
            const responseTime = Date.now() - startTime;
            logger.debug(`[${req.method}] ${req.url} - ${responseTime}ms`);
        });
        next();
    }
};
exports.LoggerResponseTimeMiddleware = LoggerResponseTimeMiddleware;
exports.LoggerResponseTimeMiddleware = LoggerResponseTimeMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerResponseTimeMiddleware);
//# sourceMappingURL=logger-response-time.middleware.js.map