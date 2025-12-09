import { CategoryAdminController_getAllCategories_Params, CategoryAdminController_getAllCategories_Request, CategoryAdminController_getAllCategories_Response } from "@/lib/open-api-client/type.admin";

export type CategoryParams = CategoryAdminController_getAllCategories_Params['query'];
export type CategoryRequest = CategoryAdminController_getAllCategories_Request;
export type CategoryResponse = CategoryAdminController_getAllCategories_Response['data'];
export type Category = CategoryResponse['items'][number];

