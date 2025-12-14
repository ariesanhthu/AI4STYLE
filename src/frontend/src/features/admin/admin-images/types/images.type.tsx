import { paths } from "@/lib/open-api-client";
import { UploadAdminController_bulkDeleteImages_Request, UploadAdminController_bulkDeleteImages_Response, UploadAdminController_bulkUploadImages_Request, UploadAdminController_bulkUploadImages_Response, UploadAdminController_deleteImage_Params, UploadAdminController_deleteImage_Response, UploadAdminController_getListImages_Params, UploadAdminController_getListImages_Response, UploadAdminController_uploadImage_Request, UploadAdminController_uploadImage_Response } from "@/lib/open-api-client/type.admin";


//endpoint: /shop/v1/admin/upload/images
// type UploadImageRequest = {
//     title: string;
//     file: string;
// }
export type UploadImageRequest = UploadAdminController_uploadImage_Request
export type UploadImageResponse = UploadAdminController_uploadImage_Response['data']

//endpoint: /shop/v1/admin/upload/images/bulk
// type BulkUploadImageRequest = {
//     titles?: string | undefined; // list of titles separated by comma, for example: title1,title2,title3
//     files: string[];
// }
export type BulkUploadImageRequest = UploadAdminController_bulkUploadImages_Request
export type BulkUploadImageResponse = UploadAdminController_bulkUploadImages_Response['data']

//endpoint: /shop/v1/admin/upload/images
export type BulkDeleteImageRequest = UploadAdminController_bulkDeleteImages_Request
export type BulkDeleteImageResponse = UploadAdminController_bulkDeleteImages_Response['data']

//endpoint: /shop/v1/admin/upload/images/{id}
export type DeleteImageRequest = UploadAdminController_deleteImage_Params
export type DeleteImageResponse = UploadAdminController_deleteImage_Response['data']

//endpoint: /shop/v1/admin/upload/images
export type GetListImageRequest = UploadAdminController_getListImages_Params
export type GetListImageResponse = UploadAdminController_getListImages_Response['data']

export type ErrorResponse = paths['/shop/v1/admin/upload/images']['post']['responses']['4XX']['content']['application/json']