import { ProductService } from '@/application/product/services';

export abstract class BaseProductController {
  constructor(protected readonly productService: ProductService) {}
}
