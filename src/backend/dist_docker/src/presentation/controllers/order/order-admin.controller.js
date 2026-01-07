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
exports.OrderAdminController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../../application/order/services");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../application/order/dtos");
const base_order_controller_1 = require("./base-order.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_2 = require("../../../shared/dtos");
let OrderAdminController = class OrderAdminController extends base_order_controller_1.BaseOrderController {
    orderService;
    constructor(orderService) {
        super(orderService);
        this.orderService = orderService;
    }
    getListOfOrders(query) {
        return this.orderService.getListOfOrders(query);
    }
    updateOrderStatus(id, body) {
        return this.orderService.updateOrderStatus(id, body);
    }
    deleteOrder(id) {
        return this.orderService.deleteOrder(id);
    }
};
exports.OrderAdminController = OrderAdminController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.orderResponseSchema),
        description: 'List of orders retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of orders with filtering and pagination' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListOfOrdersQuerySchema),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListOfOrdersQuerySchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrderAdminController.prototype, "getListOfOrders", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_1.orderResponseSchema,
        description: 'Order status updated successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status' }),
    (0, decorators_1.ApiZodBody)(dtos_1.updateOrderStatusSchema),
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.ZodBody)(dtos_1.updateOrderStatusSchema)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderAdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: dtos_2.statusResponseSchema,
        description: 'Order deleted successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order (only CANCELED orders)' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderAdminController.prototype, "deleteOrder", null);
exports.OrderAdminController = OrderAdminController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.ADMIN}-${enums_1.ESwaggerTag.ORDER}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, decorators_1.Permissions)(enums_1.EPermission.ORDER_MANAGEMENT),
    (0, common_1.Controller)('admin/orders'),
    __metadata("design:paramtypes", [services_1.OrderService])
], OrderAdminController);
//# sourceMappingURL=order-admin.controller.js.map