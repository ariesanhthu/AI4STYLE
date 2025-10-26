export interface ProductImage {
  url: string;
  alt: string;
}

export interface Size {
  value: string;
  label: string;
  available: boolean;
}

export interface Color {
  name: string;
  value: string;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  images: ProductImage[];
  sizes: Size[];
  colors: Color[];
  fabric: string;
  care: string[];
  features: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  search?: string;
}

export interface SortOption {
  field: 'price' | 'rating' | 'name' | 'createdAt';
  direction: 'asc' | 'desc';
}
