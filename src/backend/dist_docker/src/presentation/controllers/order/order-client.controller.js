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
exports.OrderClientController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../../application/order/services");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../../application/order/dtos");
const base_order_controller_1 = require("./base-order.controller");
const enums_1 = require("../../../shared/enums");
const decorators_1 = require("../../guards/decorators");
const dtos_2 = require("../../../shared/dtos");
let OrderClientController = class OrderClientController extends base_order_controller_1.BaseOrderController {
    orderService;
    constructor(orderService) {
        super(orderService);
        this.orderService = orderService;
    }
    createOrder(body, user) {
        return this.orderService.createOrder(user.id, body);
    }
    getMyOrders(query, user) {
        query.customerId = user.id;
        return this.orderService.getListOfOrders(query);
    }
};
exports.OrderClientController = OrderClientController;
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 201,
        schema: dtos_1.orderResponseSchema,
        description: 'Order created successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, decorators_1.ApiZodBody)(dtos_1.createOrderSchema),
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.ZodBody)(dtos_1.createOrderSchema)),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrderClientController.prototype, "createOrder", null);
__decorate([
    (0, decorators_1.ApiZodResponse)({
        status: 200,
        schema: (0, dtos_2.createPaginationCursorResponseSchema)(dtos_1.orderResponseSchema),
        description: 'List of user orders retrieved successfully',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of current user orders' }),
    (0, decorators_1.ApiZodQuery)(dtos_1.getListOfOrdersQuerySchema),
    (0, common_1.Get)('my-orders'),
    __param(0, (0, decorators_1.ZodQuery)(dtos_1.getListOfOrdersQuerySchema)),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrderClientController.prototype, "getMyOrders", null);
exports.OrderClientController = OrderClientController = __decorate([
    (0, swagger_1.ApiTags)(`${enums_1.ESwaggerTagPrefix.CLIENT}-${enums_1.ESwaggerTag.ORDER}`),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiSecurity)('x-api-key'),
    (0, decorators_1.ApiZodErrorResponse)(dtos_2.errorResponseSchema),
    (0, common_1.Controller)('client/orders'),
    __metadata("design:paramtypes", [services_1.OrderService])
], OrderClientController);
//# sourceMappingURL=order-client.controller.js.map