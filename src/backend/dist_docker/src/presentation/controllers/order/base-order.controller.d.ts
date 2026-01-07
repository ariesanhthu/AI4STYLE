import { OrderService } from '@/application/order/services';
export declare abstract class BaseOrderController {
    protected readonly orderService: OrderService;
    constructor(orderService: OrderService);
    getOrderById(id: string): Promise<{}>;
    getOrderByCode(code: string): Promise<{}>;
}
