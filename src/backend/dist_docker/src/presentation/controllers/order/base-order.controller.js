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
exports.BaseOrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../guards/decorators");
const dtos_1 = require("../../../application/order/dtos");
class BaseOrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    getOrderById(id) {
        return this.orderService.getById(id);
    }
    getOrderByCode(code) {
        return this.orderService.getByCode(code);
    }
}
exports.BaseOrderController = BaseOrderController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.orderResponseDetailDtoSchema,
        description: 'Order retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseOrderController.prototype, "getOrderById", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.orderResponseDetailDtoSchema,
        description: 'Order retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by code' }),
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BaseOrderController.prototype, "getOrderByCode", null);
//# sourceMappingURL=base-order.controller.js.map