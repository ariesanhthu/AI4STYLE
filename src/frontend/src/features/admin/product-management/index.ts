export { ProductForm } from "./components/ProductForm";
export { ProductManagement } from "./components/ProductManagement";
export * from "./types/schema"; // Keep existing schema exports
import productService from "./services/product.service";
export { productService };
