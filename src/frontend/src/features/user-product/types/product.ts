import type {
  ProductClientController_getAllProductOptions_Params,
  ProductClientController_getAllProductOptions_Response,
  ProductClientController_getProductOptionById_Params,
  ProductClientController_getProductOptionById_Response,
} from "@/lib/open-api-client/type.client";

export type GetProductsParams =
  ProductClientController_getAllProductOptions_Params;
export type GetProductByIdParams =
  ProductClientController_getProductOptionById_Params;
export type GetProductsResponse =
  ProductClientController_getAllProductOptions_Response;
export type GetProductByIdResponse =
  ProductClientController_getProductOptionById_Response;

export interface Product {
  optionId: string;
  productId: string;
  name: string;
  slug: string;
  color: string;
  colorFamily: string;
  thumbnail: string | null;
  images: string[];
  price: number;
  newPrice: number | null;
  outOfStock: boolean;
  isShow: boolean;
  // search: string;
  createdAt: string;
  updatedAt: string;
  hasDiscount: boolean;
  discountPercentage: number | null;
  variants: ProductVariant[];
  otherOptions: ProductOption[];
}

export interface ProductOption {
  optionId: string;
  slug: string;
  thumbnail: string | null;
}

export interface ProductVariant {
  variantId: string;
  optionId: string;
  sku: string;
  size: string;
  price: number;
  newPrice: number | null;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  hasDiscount: boolean;
  discountPercentage: number | null;
  inStock: boolean;
  lowStock: boolean;
}
