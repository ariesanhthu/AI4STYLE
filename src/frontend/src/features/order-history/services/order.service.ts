'use client';

import { apiClient } from '@/lib/open-api-client';
import { Order, OrdersResponse } from '../types/order';

const MOCK_ENABLED = false; // Set to false to use real API

// Cache for orders by cursor
const ordersCache = new Map<string, OrdersResponse>();

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    code: 'ORD-2025-001',
    status: 'delivered',
    total: 1798000,
    items: [
      {
        id: 'item-1',
        productId: '1',
        productName: 'Áo Thun Premium Cotton',
        productImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        quantity: 2,
        price: 299000,
        size: 'M',
        color: 'Đen',
      },
      {
        id: 'item-2',
        productId: '4',
        productName: 'Giày Sneaker Classic',
        productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        quantity: 1,
        price: 1299000,
        size: '40',
        color: 'Trắng',
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    paymentMethod: 'COD',
  },
  {
    id: '2',
    code: 'ORD-2025-002',
    status: 'shipping',
    total: 899000,
    items: [
      {
        id: 'item-3',
        productId: '3',
        productName: 'Áo Khoác Bomber',
        productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
        quantity: 1,
        price: 899000,
        size: 'L',
        color: 'Navy',
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: '456 Lê Văn Việt, Quận 9, TP.HCM',
    paymentMethod: 'Chuyển khoản',
  },
  {
    id: '3',
    code: 'ORD-2025-003',
    status: 'processing',
    total: 998000,
    items: [
      {
        id: 'item-4',
        productId: '2',
        productName: 'Quần Jeans Slim Fit',
        productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        quantity: 1,
        price: 599000,
        size: '30',
        color: 'Xanh đen',
      },
      {
        id: 'item-5',
        productId: '6',
        productName: 'Áo Sơ Mi Linen',
        productImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        quantity: 1,
        price: 399000,
        size: 'M',
        color: 'Trắng',
      },
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: '789 Võ Văn Ngân, Thủ Đức, TP.HCM',
    paymentMethod: 'Thẻ tín dụng',
  },
];

export const orderService = {
  /**
   * Get my orders with cursor pagination
   */
  async getMyOrders(cursor?: string): Promise<OrdersResponse> {
    const cacheKey = cursor || 'initial';
    
    // Check cache first
    if (ordersCache.has(cacheKey)) {
      return ordersCache.get(cacheKey)!;
    }

    try {
      if (MOCK_ENABLED) {
        // Mock mode for UI development
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const ordersResponse: OrdersResponse = {
          data: mockOrders,
          cursor: {
            next: undefined,
            prev: undefined,
          },
          hasMore: false,
        };

        ordersCache.set(cacheKey, ordersResponse);
        return ordersResponse;
      }

      // Real API call
      const response = await apiClient.GET('/shop/v1/client/orders/my-orders', {
        params: {
          query: cursor ? { cursor } : {},
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch orders');
      }

      // Transform response to our format
      const ordersResponse: OrdersResponse = {
        data: response.data?.data || [],
        cursor: {
          next: response.data?.cursor?.next,
          prev: response.data?.cursor?.prev,
        },
        hasMore: response.data?.hasMore || false,
      };

      // Cache the result
      ordersCache.set(cacheKey, ordersResponse);

      return ordersResponse;
    } catch (error) {
      console.error('[OrderService] Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await apiClient.GET('/shop/v1/client/orders/{id}', {
        params: {
          path: { id },
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch order');
      }

      return response.data?.data as Order;
    } catch (error) {
      console.error('[OrderService] Error fetching order:', error);
      throw error;
    }
  },

  /**
   * Clear cache (useful after order status changes)
   */
  clearCache() {
    ordersCache.clear();
  },
};
