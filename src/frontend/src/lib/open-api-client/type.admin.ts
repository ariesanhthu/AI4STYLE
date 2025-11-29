import { operations } from './open-api';

// Helper types to extract Request and Response bodies
export type OperationRequest<T> = T extends { requestBody?: { content: { 'application/json': infer R } } } ? R : never;
export type OperationResponse<T> = T extends { responses: { 200: { content: { 'application/json': infer R } } } } ? R : T extends { responses: { 201: { content: { 'application/json': infer R } } } } ? R : never;

// Operation: UserAdminController_getList_shop/v1
export type UserAdminController_getList_Params = operations['UserAdminController_getList_shop/v1']['parameters'];
export type UserAdminController_getList_Request = OperationRequest<operations['UserAdminController_getList_shop/v1']>;
export type UserAdminController_getList_Response = OperationResponse<operations['UserAdminController_getList_shop/v1']>;

// Operation: UserAdminController_getProfile_shop/v1
export type UserAdminController_getProfile_Params = operations['UserAdminController_getProfile_shop/v1']['parameters'];
export type UserAdminController_getProfile_Request = OperationRequest<operations['UserAdminController_getProfile_shop/v1']>;
export type UserAdminController_getProfile_Response = OperationResponse<operations['UserAdminController_getProfile_shop/v1']>;

// Operation: UserAdminController_updateProfile_shop/v1
export type UserAdminController_updateProfile_Params = operations['UserAdminController_updateProfile_shop/v1']['parameters'];
export type UserAdminController_updateProfile_Request = OperationRequest<operations['UserAdminController_updateProfile_shop/v1']>;
export type UserAdminController_updateProfile_Response = OperationResponse<operations['UserAdminController_updateProfile_shop/v1']>;

// Operation: AuthAdminController_signUp_shop/v1
export type AuthAdminController_signUp_Params = operations['AuthAdminController_signUp_shop/v1']['parameters'];
export type AuthAdminController_signUp_Request = OperationRequest<operations['AuthAdminController_signUp_shop/v1']>;
export type AuthAdminController_signUp_Response = OperationResponse<operations['AuthAdminController_signUp_shop/v1']>;

// Operation: AuthAdminController_signIn_shop/v1
export type AuthAdminController_signIn_Params = operations['AuthAdminController_signIn_shop/v1']['parameters'];
export type AuthAdminController_signIn_Request = OperationRequest<operations['AuthAdminController_signIn_shop/v1']>;
export type AuthAdminController_signIn_Response = OperationResponse<operations['AuthAdminController_signIn_shop/v1']>;

// Operation: AuthAdminController_signOut_shop/v1
export type AuthAdminController_signOut_Params = operations['AuthAdminController_signOut_shop/v1']['parameters'];
export type AuthAdminController_signOut_Request = OperationRequest<operations['AuthAdminController_signOut_shop/v1']>;
export type AuthAdminController_signOut_Response = OperationResponse<operations['AuthAdminController_signOut_shop/v1']>;

// Operation: AuthAdminController_changePassword_shop/v1
export type AuthAdminController_changePassword_Params = operations['AuthAdminController_changePassword_shop/v1']['parameters'];
export type AuthAdminController_changePassword_Request = OperationRequest<operations['AuthAdminController_changePassword_shop/v1']>;
export type AuthAdminController_changePassword_Response = OperationResponse<operations['AuthAdminController_changePassword_shop/v1']>;

// Operation: AuthAdminController_forgetPassword_shop/v1
export type AuthAdminController_forgetPassword_Params = operations['AuthAdminController_forgetPassword_shop/v1']['parameters'];
export type AuthAdminController_forgetPassword_Request = OperationRequest<operations['AuthAdminController_forgetPassword_shop/v1']>;
export type AuthAdminController_forgetPassword_Response = OperationResponse<operations['AuthAdminController_forgetPassword_shop/v1']>;

// Operation: AuthAdminController_refreshToken_shop/v1
export type AuthAdminController_refreshToken_Params = operations['AuthAdminController_refreshToken_shop/v1']['parameters'];
export type AuthAdminController_refreshToken_Request = OperationRequest<operations['AuthAdminController_refreshToken_shop/v1']>;
export type AuthAdminController_refreshToken_Response = OperationResponse<operations['AuthAdminController_refreshToken_shop/v1']>;

// Operation: AuthAdminController_requestOtp_shop/v1
export type AuthAdminController_requestOtp_Params = operations['AuthAdminController_requestOtp_shop/v1']['parameters'];
export type AuthAdminController_requestOtp_Request = OperationRequest<operations['AuthAdminController_requestOtp_shop/v1']>;
export type AuthAdminController_requestOtp_Response = OperationResponse<operations['AuthAdminController_requestOtp_shop/v1']>;

// Operation: AuthAdminController_verifyOtp_shop/v1
export type AuthAdminController_verifyOtp_Params = operations['AuthAdminController_verifyOtp_shop/v1']['parameters'];
export type AuthAdminController_verifyOtp_Request = OperationRequest<operations['AuthAdminController_verifyOtp_shop/v1']>;
export type AuthAdminController_verifyOtp_Response = OperationResponse<operations['AuthAdminController_verifyOtp_shop/v1']>;

// Operation: UploadAdminController_uploadImage_shop/v1
export type UploadAdminController_uploadImage_Params = operations['UploadAdminController_uploadImage_shop/v1']['parameters'];
export type UploadAdminController_uploadImage_Request = OperationRequest<operations['UploadAdminController_uploadImage_shop/v1']>;
export type UploadAdminController_uploadImage_Response = OperationResponse<operations['UploadAdminController_uploadImage_shop/v1']>;

// Operation: UploadAdminController_bulkUploadImages_shop/v1
export type UploadAdminController_bulkUploadImages_Params = operations['UploadAdminController_bulkUploadImages_shop/v1']['parameters'];
export type UploadAdminController_bulkUploadImages_Request = OperationRequest<operations['UploadAdminController_bulkUploadImages_shop/v1']>;
export type UploadAdminController_bulkUploadImages_Response = OperationResponse<operations['UploadAdminController_bulkUploadImages_shop/v1']>;

// Operation: UploadAdminController_getListImages_shop/v1
export type UploadAdminController_getListImages_Params = operations['UploadAdminController_getListImages_shop/v1']['parameters'];
export type UploadAdminController_getListImages_Request = OperationRequest<operations['UploadAdminController_getListImages_shop/v1']>;
export type UploadAdminController_getListImages_Response = OperationResponse<operations['UploadAdminController_getListImages_shop/v1']>;

// Operation: UploadAdminController_getImageById_shop/v1
export type UploadAdminController_getImageById_Params = operations['UploadAdminController_getImageById_shop/v1']['parameters'];
export type UploadAdminController_getImageById_Request = OperationRequest<operations['UploadAdminController_getImageById_shop/v1']>;
export type UploadAdminController_getImageById_Response = OperationResponse<operations['UploadAdminController_getImageById_shop/v1']>;

// Operation: UploadAdminController_deleteImage_shop/v1
export type UploadAdminController_deleteImage_Params = operations['UploadAdminController_deleteImage_shop/v1']['parameters'];
export type UploadAdminController_deleteImage_Request = OperationRequest<operations['UploadAdminController_deleteImage_shop/v1']>;
export type UploadAdminController_deleteImage_Response = OperationResponse<operations['UploadAdminController_deleteImage_shop/v1']>;

// Operation: UploadAdminController_bulkDeleteImages_shop/v1
export type UploadAdminController_bulkDeleteImages_Params = operations['UploadAdminController_bulkDeleteImages_shop/v1']['parameters'];
export type UploadAdminController_bulkDeleteImages_Request = OperationRequest<operations['UploadAdminController_bulkDeleteImages_shop/v1']>;
export type UploadAdminController_bulkDeleteImages_Response = OperationResponse<operations['UploadAdminController_bulkDeleteImages_shop/v1']>;

// Operation: CategoryAdminController_getAllCategories_shop/v1
export type CategoryAdminController_getAllCategories_Params = operations['CategoryAdminController_getAllCategories_shop/v1']['parameters'];
export type CategoryAdminController_getAllCategories_Request = OperationRequest<operations['CategoryAdminController_getAllCategories_shop/v1']>;
export type CategoryAdminController_getAllCategories_Response = OperationResponse<operations['CategoryAdminController_getAllCategories_shop/v1']>;

// Operation: CategoryAdminController_createCategory_shop/v1
export type CategoryAdminController_createCategory_Params = operations['CategoryAdminController_createCategory_shop/v1']['parameters'];
export type CategoryAdminController_createCategory_Request = OperationRequest<operations['CategoryAdminController_createCategory_shop/v1']>;
export type CategoryAdminController_createCategory_Response = OperationResponse<operations['CategoryAdminController_createCategory_shop/v1']>;

// Operation: CategoryAdminController_getCategoryById_shop/v1
export type CategoryAdminController_getCategoryById_Params = operations['CategoryAdminController_getCategoryById_shop/v1']['parameters'];
export type CategoryAdminController_getCategoryById_Request = OperationRequest<operations['CategoryAdminController_getCategoryById_shop/v1']>;
export type CategoryAdminController_getCategoryById_Response = OperationResponse<operations['CategoryAdminController_getCategoryById_shop/v1']>;

// Operation: CategoryAdminController_updateCategory_shop/v1
export type CategoryAdminController_updateCategory_Params = operations['CategoryAdminController_updateCategory_shop/v1']['parameters'];
export type CategoryAdminController_updateCategory_Request = OperationRequest<operations['CategoryAdminController_updateCategory_shop/v1']>;
export type CategoryAdminController_updateCategory_Response = OperationResponse<operations['CategoryAdminController_updateCategory_shop/v1']>;

// Operation: CategoryAdminController_deleteCategory_shop/v1
export type CategoryAdminController_deleteCategory_Params = operations['CategoryAdminController_deleteCategory_shop/v1']['parameters'];
export type CategoryAdminController_deleteCategory_Request = OperationRequest<operations['CategoryAdminController_deleteCategory_shop/v1']>;
export type CategoryAdminController_deleteCategory_Response = OperationResponse<operations['CategoryAdminController_deleteCategory_shop/v1']>;

// Operation: CategoryAdminController_getCategoriesBySlug_shop/v1
export type CategoryAdminController_getCategoriesBySlug_Params = operations['CategoryAdminController_getCategoriesBySlug_shop/v1']['parameters'];
export type CategoryAdminController_getCategoriesBySlug_Request = OperationRequest<operations['CategoryAdminController_getCategoriesBySlug_shop/v1']>;
export type CategoryAdminController_getCategoriesBySlug_Response = OperationResponse<operations['CategoryAdminController_getCategoriesBySlug_shop/v1']>;

// Operation: ProductAdminController_getProductById_shop/v1
export type ProductAdminController_getProductById_Params = operations['ProductAdminController_getProductById_shop/v1']['parameters'];
export type ProductAdminController_getProductById_Request = OperationRequest<operations['ProductAdminController_getProductById_shop/v1']>;
export type ProductAdminController_getProductById_Response = OperationResponse<operations['ProductAdminController_getProductById_shop/v1']>;

// Operation: ProductAdminController_deleteProduct_shop/v1
export type ProductAdminController_deleteProduct_Params = operations['ProductAdminController_deleteProduct_shop/v1']['parameters'];
export type ProductAdminController_deleteProduct_Request = OperationRequest<operations['ProductAdminController_deleteProduct_shop/v1']>;
export type ProductAdminController_deleteProduct_Response = OperationResponse<operations['ProductAdminController_deleteProduct_shop/v1']>;

// Operation: ProductAdminController_updateProduct_shop/v1
export type ProductAdminController_updateProduct_Params = operations['ProductAdminController_updateProduct_shop/v1']['parameters'];
export type ProductAdminController_updateProduct_Request = OperationRequest<operations['ProductAdminController_updateProduct_shop/v1']>;
export type ProductAdminController_updateProduct_Response = OperationResponse<operations['ProductAdminController_updateProduct_shop/v1']>;

// Operation: ProductAdminController_getAllProducts_shop/v1
export type ProductAdminController_getAllProducts_Params = operations['ProductAdminController_getAllProducts_shop/v1']['parameters'];
export type ProductAdminController_getAllProducts_Request = OperationRequest<operations['ProductAdminController_getAllProducts_shop/v1']>;
export type ProductAdminController_getAllProducts_Response = OperationResponse<operations['ProductAdminController_getAllProducts_shop/v1']>;

// Operation: ProductAdminController_createProduct_shop/v1
export type ProductAdminController_createProduct_Params = operations['ProductAdminController_createProduct_shop/v1']['parameters'];
export type ProductAdminController_createProduct_Request = OperationRequest<operations['ProductAdminController_createProduct_shop/v1']>;
export type ProductAdminController_createProduct_Response = OperationResponse<operations['ProductAdminController_createProduct_shop/v1']>;

// Operation: ProductAdminController_updateProductStockPrice_shop/v1
export type ProductAdminController_updateProductStockPrice_Params = operations['ProductAdminController_updateProductStockPrice_shop/v1']['parameters'];
export type ProductAdminController_updateProductStockPrice_Request = OperationRequest<operations['ProductAdminController_updateProductStockPrice_shop/v1']>;
export type ProductAdminController_updateProductStockPrice_Response = OperationResponse<operations['ProductAdminController_updateProductStockPrice_shop/v1']>;
