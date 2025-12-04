export interface Product {
  optionId: string;
  productId: string;
  name: string;
  slug: string;
  color: string;
  colorFamily: string;
  thumbnail: string;
  images: string[];
  price: number;
  newPrice: number;
  outOfStock: boolean;
  isShow: boolean;
  search: string;
  createdAt: string;
  updatedAt: string;
  hasDiscount: boolean;
  discountPercentage: number;
  variants: ProductVariant[];
}

export interface ProductVariant {
  variantId: string;
  optionId: string;
  sku: string;
  size: string;
  price: number;
  newPrice: number;
  displayPrice: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  hasDiscount: boolean;
  discountPercentage: number;
  inStock: boolean;
  lowStock: boolean;
}
