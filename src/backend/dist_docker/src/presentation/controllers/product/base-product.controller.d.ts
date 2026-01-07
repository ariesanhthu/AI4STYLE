import { ProductService } from '@/application/product/services';
export declare abstract class BaseProductController {
    protected readonly productService: ProductService;
    constructor(productService: ProductService);
}
