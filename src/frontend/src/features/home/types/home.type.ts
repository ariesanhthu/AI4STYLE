import { ProductClientController_getAllProductOptions_Params, ProductClientController_getAllProductOptions_Response, ProductClientController_getBestSellers_Params, ProductClientController_getBestSellers_Response } from "@/lib/open-api-client/type.client";


// endpoint: shop/v1/client/products/best-sellers
export type ProductBestSellerParams = ProductClientController_getBestSellers_Params
export type ProductBestSellerResponse = ProductClientController_getBestSellers_Response['data']


// endpoint: shop/v1/client/products/options
export type ProductListParams = ProductClientController_getAllProductOptions_Params
export type ProductListResponse = ProductClientController_getAllProductOptions_Response['data']

