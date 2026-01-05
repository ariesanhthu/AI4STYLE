import { paths } from '@/lib/open-api-client';

export type ProductListResponse = paths['/shop/v1/admin/product']['get']['responses']['200']['content']['application/json'];

// The actual product data is nested inside 'data.items'
export type Product = ProductListResponse['data']['items'][number];

export type ProductFilter = paths['/shop/v1/admin/product']['get']['parameters']['query'];
