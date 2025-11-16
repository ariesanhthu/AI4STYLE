import { ProductService } from '../product.service';

export abstract class BaseProductController {
  constructor(protected readonly productService: ProductService) {}
}
