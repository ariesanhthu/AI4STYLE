'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/open-api-client';
import { Product, ProductFilters, SortOption } from '../types/product';

const MOCK_ENABLED = true; // Set to false to use real API

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Áo Thun Premium Cotton',
    brand: 'AI4STYLE',
    description: 'Áo thun cao cấp chất liệu cotton 100% thoáng mát',
    price: 299000,
    originalPrice: 399000,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Áo Thun' }],
    sizes: [
      { value: 'S', label: 'S', available: true },
      { value: 'M', label: 'M', available: true },
      { value: 'L', label: 'L', available: true },
    ],
    colors: [
      { name: 'Đen', value: '#000000', available: true },
      { name: 'Trắng', value: '#FFFFFF', available: true },
    ],
    fabric: 'Cotton 100%',
    care: ['Giặt máy', 'Không tẩy'],
    features: ['Thoáng mát', 'Co giãn nhẹ'],
    stock: 50,
    rating: 4.5,
    reviewCount: 234,
    category: 'Áo',
    tags: ['bestseller', 'summer'],
  },
  {
    id: '2',
    name: 'Quần Jeans Slim Fit',
    brand: 'AI4STYLE',
    description: 'Quần jeans ôm vừa phải, phong cách trẻ trung',
    price: 599000,
    originalPrice: 799000,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', alt: 'Quần Jeans' }],
    sizes: [
      { value: '29', label: '29', available: true },
      { value: '30', label: '30', available: true },
      { value: '31', label: '31', available: true },
    ],
    colors: [
      { name: 'Xanh đen', value: '#1a1a2e', available: true },
      { name: 'Xanh nhạt', value: '#6495ed', available: true },
    ],
    fabric: 'Denim',
    care: ['Giặt lộn mặt', 'Không vắt'],
    features: ['Slim fit', 'Co giãn'],
    stock: 30,
    rating: 4.7,
    reviewCount: 156,
    category: 'Quần',
    tags: ['bestseller'],
  },
  {
    id: '3',
    name: 'Áo Khoác Bomber',
    brand: 'AI4STYLE',
    description: 'Áo khoác bomber phong cách năng động',
    price: 899000,
    originalPrice: 1199000,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', alt: 'Áo Khoác' }],
    sizes: [
      { value: 'M', label: 'M', available: true },
      { value: 'L', label: 'L', available: true },
      { value: 'XL', label: 'XL', available: true },
    ],
    colors: [
      { name: 'Đen', value: '#000000', available: true },
      { name: 'Navy', value: '#000080', available: true },
    ],
    fabric: 'Polyester',
    care: ['Giặt khô', 'Không ủi'],
    features: ['Chống gió', 'Nhẹ'],
    stock: 20,
    rating: 4.8,
    reviewCount: 89,
    category: 'Áo khoác',
    tags: ['new', 'winter'],
  },
  {
    id: '4',
    name: 'Giày Sneaker Classic',
    brand: 'AI4STYLE',
    description: 'Giày sneaker phong cách cổ điển',
    price: 1299000,
    originalPrice: 1599000,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', alt: 'Giày Sneaker' }],
    sizes: [
      { value: '39', label: '39', available: true },
      { value: '40', label: '40', available: true },
      { value: '41', label: '41', available: true },
    ],
    colors: [
      { name: 'Trắng', value: '#FFFFFF', available: true },
      { name: 'Đen', value: '#000000', available: true },
    ],
    fabric: 'Canvas + Rubber',
    care: ['Lau sạch', 'Tránh nước'],
    features: ['Đế cao su', 'Thoáng khí'],
    stock: 40,
    rating: 4.6,
    reviewCount: 341,
    category: 'Giày',
    tags: ['bestseller'],
  },
  {
    id: '5',
    name: 'Túi Xách Mini',
    brand: 'AI4STYLE',
    description: 'Túi xách nhỏ gọn tiện dụng',
    price: 499000,
    originalPrice: 699000,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', alt: 'Túi Xách' }],
    sizes: [
      { value: 'OneSize', label: 'One Size', available: true },
    ],
    colors: [
      { name: 'Nâu', value: '#8b4513', available: true },
      { name: 'Đen', value: '#000000', available: true },
    ],
    fabric: 'Da PU',
    care: ['Lau khô', 'Tránh nắng'],
    features: ['Nhỏ gọn', 'Nhiều ngăn'],
    stock: 25,
    rating: 4.4,
    reviewCount: 78,
    category: 'Phụ kiện',
    tags: ['new', 'trending'],
  },
  {
    id: '6',
    name: 'Áo Sơ Mi Linen',
    brand: 'AI4STYLE',
    description: 'Áo sơ mi linen mát mẻ thoáng khí',
    price: 399000,
    originalPrice: 549000,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    images: [{ url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500', alt: 'Áo Sơ Mi' }],
    sizes: [
      { value: 'S', label: 'S', available: true },
      { value: 'M', label: 'M', available: true },
      { value: 'L', label: 'L', available: true },
    ],
    colors: [
      { name: 'Trắng', value: '#FFFFFF', available: true },
      { name: 'Be', value: '#f5f5dc', available: true },
    ],
    fabric: 'Linen 100%',
    care: ['Giặt tay', 'Ủi nhiệt độ thấp'],
    features: ['Thoáng mát', 'Chống nhăn'],
    stock: 35,
    rating: 4.5,
    reviewCount: 123,
    category: 'Áo',
    tags: ['new', 'summer'],
  },
];

export const useProducts = (filters?: ProductFilters, sort?: SortOption) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (MOCK_ENABLED) {
          // Mock mode for UI development
          await new Promise(resolve => setTimeout(resolve, 500));
          setProducts(mockProducts);
        } else {
          // Real API call
          const response = await apiClient.GET('/shop/v1/client/home-page', {});

          if (response.error) {
            throw new Error(response.error.message || 'Failed to fetch products');
          }

          if (response.data?.data) {
            // Extract products from homepage response
            const productsData = response.data.data.products || [];
            setProducts(productsData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
};
