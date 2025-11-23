import { type paths } from '@/lib/open-api-client/';

export type CreateProductDto = paths['/shop/v1/admin/product']['post']['requestBody']['content']['application/json'];
export type UpdateProductDto = paths['/shop/v1/admin/product/{id}']['patch']['requestBody']['content']['application/json'];
export type GetListProductDto = paths['/shop/v1/admin/product']['get']['parameters']['query'];
export type UpdateProductStockPriceDto = paths['/shop/v1/admin/product/{id}/inventory']['patch']['requestBody']['content']['application/json'];
export type GetProductByIdQueryDto = paths['/shop/v1/admin/product/{id}']['get']['parameters']['query'];