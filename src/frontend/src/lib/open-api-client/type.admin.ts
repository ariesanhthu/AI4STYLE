import { operations } from './open-api';

// Helper types to extract Request and Response bodies
export type OperationParams<T> = T extends { parameters: { query?: infer Q } } ? Q : never;
export type OperationRequest<T> = T extends { requestBody?: { content: { 'application/json': infer R } } } ? R : T extends { requestBody?: { content: { 'multipart/form-data': infer F } } } ? F : never;
export type OperationResponse<T> = T extends { responses: { 200: { content: { 'application/json': infer R } } } } ? R : T extends { responses: { 201: { content: { 'application/json': infer R } } } } ? R : never;

// Operation: RoleAdminController_getListRoles_shop/v1
export type RoleAdminController_getListRoles_Params = OperationParams<operations['RoleAdminController_getListRoles_shop/v1']>;
export type RoleAdminController_getListRoles_Request = OperationRequest<operations['RoleAdminController_getListRoles_shop/v1']>;
export type RoleAdminController_getListRoles_Response = OperationResponse<operations['RoleAdminController_getListRoles_shop/v1']>;

// Operation: RoleAdminController_getRoleById_shop/v1
export type RoleAdminController_getRoleById_Params = OperationParams<operations['RoleAdminController_getRoleById_shop/v1']>;
export type RoleAdminController_getRoleById_Request = OperationRequest<operations['RoleAdminController_getRoleById_shop/v1']>;
export type RoleAdminController_getRoleById_Response = OperationResponse<operations['RoleAdminController_getRoleById_shop/v1']>;

// Operation: RoleAdminController_deleteRole_shop/v1
export type RoleAdminController_deleteRole_Params = OperationParams<operations['RoleAdminController_deleteRole_shop/v1']>;
export type RoleAdminController_deleteRole_Request = OperationRequest<operations['RoleAdminController_deleteRole_shop/v1']>;
export type RoleAdminController_deleteRole_Response = OperationResponse<operations['RoleAdminController_deleteRole_shop/v1']>;

// Operation: RoleAdminController_updateRole_shop/v1
export type RoleAdminController_updateRole_Params = OperationParams<operations['RoleAdminController_updateRole_shop/v1']>;
export type RoleAdminController_updateRole_Request = OperationRequest<operations['RoleAdminController_updateRole_shop/v1']>;
export type RoleAdminController_updateRole_Response = OperationResponse<operations['RoleAdminController_updateRole_shop/v1']>;

// Operation: RoleAdminController_createRole_shop/v1
export type RoleAdminController_createRole_Params = OperationParams<operations['RoleAdminController_createRole_shop/v1']>;
export type RoleAdminController_createRole_Request = OperationRequest<operations['RoleAdminController_createRole_shop/v1']>;
export type RoleAdminController_createRole_Response = OperationResponse<operations['RoleAdminController_createRole_shop/v1']>;

// Operation: RoleAdminController_getListPermissions_shop/v1
export type RoleAdminController_getListPermissions_Params = OperationParams<operations['RoleAdminController_getListPermissions_shop/v1']>;
export type RoleAdminController_getListPermissions_Request = OperationRequest<operations['RoleAdminController_getListPermissions_shop/v1']>;
export type RoleAdminController_getListPermissions_Response = OperationResponse<operations['RoleAdminController_getListPermissions_shop/v1']>;

// Operation: UserAdminController_getList_shop/v1
export type UserAdminController_getList_Params = OperationParams<operations['UserAdminController_getList_shop/v1']>;
export type UserAdminController_getList_Request = OperationRequest<operations['UserAdminController_getList_shop/v1']>;
export type UserAdminController_getList_Response = OperationResponse<operations['UserAdminController_getList_shop/v1']>;

// Operation: UserAdminController_getProfile_shop/v1
export type UserAdminController_getProfile_Params = OperationParams<operations['UserAdminController_getProfile_shop/v1']>;
export type UserAdminController_getProfile_Request = OperationRequest<operations['UserAdminController_getProfile_shop/v1']>;
export type UserAdminController_getProfile_Response = OperationResponse<operations['UserAdminController_getProfile_shop/v1']>;

// Operation: UserAdminController_updateProfile_shop/v1
export type UserAdminController_updateProfile_Params = OperationParams<operations['UserAdminController_updateProfile_shop/v1']>;
export type UserAdminController_updateProfile_Request = OperationRequest<operations['UserAdminController_updateProfile_shop/v1']>;
export type UserAdminController_updateProfile_Response = OperationResponse<operations['UserAdminController_updateProfile_shop/v1']>;

// Operation: UserAdminController_getById_shop/v1
export type UserAdminController_getById_Params = OperationParams<operations['UserAdminController_getById_shop/v1']>;
export type UserAdminController_getById_Request = OperationRequest<operations['UserAdminController_getById_shop/v1']>;
export type UserAdminController_getById_Response = OperationResponse<operations['UserAdminController_getById_shop/v1']>;

// Operation: UserAdminController_updateById_shop/v1
export type UserAdminController_updateById_Params = OperationParams<operations['UserAdminController_updateById_shop/v1']>;
export type UserAdminController_updateById_Request = OperationRequest<operations['UserAdminController_updateById_shop/v1']>;
export type UserAdminController_updateById_Response = OperationResponse<operations['UserAdminController_updateById_shop/v1']>;

// Operation: AuthAdminController_signUp_shop/v1
export type AuthAdminController_signUp_Params = OperationParams<operations['AuthAdminController_signUp_shop/v1']>;
export type AuthAdminController_signUp_Request = OperationRequest<operations['AuthAdminController_signUp_shop/v1']>;
export type AuthAdminController_signUp_Response = OperationResponse<operations['AuthAdminController_signUp_shop/v1']>;

// Operation: AuthAdminController_signIn_shop/v1
export type AuthAdminController_signIn_Params = OperationParams<operations['AuthAdminController_signIn_shop/v1']>;
export type AuthAdminController_signIn_Request = OperationRequest<operations['AuthAdminController_signIn_shop/v1']>;
export type AuthAdminController_signIn_Response = OperationResponse<operations['AuthAdminController_signIn_shop/v1']>;

// Operation: AuthAdminController_signOut_shop/v1
export type AuthAdminController_signOut_Params = OperationParams<operations['AuthAdminController_signOut_shop/v1']>;
export type AuthAdminController_signOut_Request = OperationRequest<operations['AuthAdminController_signOut_shop/v1']>;
export type AuthAdminController_signOut_Response = OperationResponse<operations['AuthAdminController_signOut_shop/v1']>;

// Operation: AuthAdminController_changePassword_shop/v1
export type AuthAdminController_changePassword_Params = OperationParams<operations['AuthAdminController_changePassword_shop/v1']>;
export type AuthAdminController_changePassword_Request = OperationRequest<operations['AuthAdminController_changePassword_shop/v1']>;
export type AuthAdminController_changePassword_Response = OperationResponse<operations['AuthAdminController_changePassword_shop/v1']>;

// Operation: AuthAdminController_forgetPassword_shop/v1
export type AuthAdminController_forgetPassword_Params = OperationParams<operations['AuthAdminController_forgetPassword_shop/v1']>;
export type AuthAdminController_forgetPassword_Request = OperationRequest<operations['AuthAdminController_forgetPassword_shop/v1']>;
export type AuthAdminController_forgetPassword_Response = OperationResponse<operations['AuthAdminController_forgetPassword_shop/v1']>;

// Operation: AuthAdminController_refreshToken_shop/v1
export type AuthAdminController_refreshToken_Params = OperationParams<operations['AuthAdminController_refreshToken_shop/v1']>;
export type AuthAdminController_refreshToken_Request = OperationRequest<operations['AuthAdminController_refreshToken_shop/v1']>;
export type AuthAdminController_refreshToken_Response = OperationResponse<operations['AuthAdminController_refreshToken_shop/v1']>;

// Operation: AuthAdminController_requestOtp_shop/v1
export type AuthAdminController_requestOtp_Params = OperationParams<operations['AuthAdminController_requestOtp_shop/v1']>;
export type AuthAdminController_requestOtp_Request = OperationRequest<operations['AuthAdminController_requestOtp_shop/v1']>;
export type AuthAdminController_requestOtp_Response = OperationResponse<operations['AuthAdminController_requestOtp_shop/v1']>;

// Operation: AuthAdminController_verifyOtp_shop/v1
export type AuthAdminController_verifyOtp_Params = OperationParams<operations['AuthAdminController_verifyOtp_shop/v1']>;
export type AuthAdminController_verifyOtp_Request = OperationRequest<operations['AuthAdminController_verifyOtp_shop/v1']>;
export type AuthAdminController_verifyOtp_Response = OperationResponse<operations['AuthAdminController_verifyOtp_shop/v1']>;

// Operation: UploadAdminController_getListImages_shop/v1
export type UploadAdminController_getListImages_Params = OperationParams<operations['UploadAdminController_getListImages_shop/v1']>;
export type UploadAdminController_getListImages_Request = OperationRequest<operations['UploadAdminController_getListImages_shop/v1']>;
export type UploadAdminController_getListImages_Response = OperationResponse<operations['UploadAdminController_getListImages_shop/v1']>;

// Operation: UploadAdminController_uploadImage_shop/v1
export type UploadAdminController_uploadImage_Params = OperationParams<operations['UploadAdminController_uploadImage_shop/v1']>;
export type UploadAdminController_uploadImage_Request = OperationRequest<operations['UploadAdminController_uploadImage_shop/v1']>;
export type UploadAdminController_uploadImage_Response = OperationResponse<operations['UploadAdminController_uploadImage_shop/v1']>;

// Operation: UploadAdminController_bulkDeleteImages_shop/v1
export type UploadAdminController_bulkDeleteImages_Params = OperationParams<operations['UploadAdminController_bulkDeleteImages_shop/v1']>;
export type UploadAdminController_bulkDeleteImages_Request = OperationRequest<operations['UploadAdminController_bulkDeleteImages_shop/v1']>;
export type UploadAdminController_bulkDeleteImages_Response = OperationResponse<operations['UploadAdminController_bulkDeleteImages_shop/v1']>;

// Operation: UploadAdminController_bulkUploadImages_shop/v1
export type UploadAdminController_bulkUploadImages_Params = OperationParams<operations['UploadAdminController_bulkUploadImages_shop/v1']>;
export type UploadAdminController_bulkUploadImages_Request = OperationRequest<operations['UploadAdminController_bulkUploadImages_shop/v1']>;
export type UploadAdminController_bulkUploadImages_Response = OperationResponse<operations['UploadAdminController_bulkUploadImages_shop/v1']>;

// Operation: UploadAdminController_getImageById_shop/v1
export type UploadAdminController_getImageById_Params = OperationParams<operations['UploadAdminController_getImageById_shop/v1']>;
export type UploadAdminController_getImageById_Request = OperationRequest<operations['UploadAdminController_getImageById_shop/v1']>;
export type UploadAdminController_getImageById_Response = OperationResponse<operations['UploadAdminController_getImageById_shop/v1']>;

// Operation: UploadAdminController_deleteImage_shop/v1
export type UploadAdminController_deleteImage_Params = OperationParams<operations['UploadAdminController_deleteImage_shop/v1']>;
export type UploadAdminController_deleteImage_Request = OperationRequest<operations['UploadAdminController_deleteImage_shop/v1']>;
export type UploadAdminController_deleteImage_Response = OperationResponse<operations['UploadAdminController_deleteImage_shop/v1']>;

// Operation: CategoryAdminController_getAllCategories_shop/v1
export type CategoryAdminController_getAllCategories_Params = OperationParams<operations['CategoryAdminController_getAllCategories_shop/v1']>;
export type CategoryAdminController_getAllCategories_Request = OperationRequest<operations['CategoryAdminController_getAllCategories_shop/v1']>;
export type CategoryAdminController_getAllCategories_Response = OperationResponse<operations['CategoryAdminController_getAllCategories_shop/v1']>;

// Operation: CategoryAdminController_createCategory_shop/v1
export type CategoryAdminController_createCategory_Params = OperationParams<operations['CategoryAdminController_createCategory_shop/v1']>;
export type CategoryAdminController_createCategory_Request = OperationRequest<operations['CategoryAdminController_createCategory_shop/v1']>;
export type CategoryAdminController_createCategory_Response = OperationResponse<operations['CategoryAdminController_createCategory_shop/v1']>;

// Operation: CategoryAdminController_getCategoryById_shop/v1
export type CategoryAdminController_getCategoryById_Params = OperationParams<operations['CategoryAdminController_getCategoryById_shop/v1']>;
export type CategoryAdminController_getCategoryById_Request = OperationRequest<operations['CategoryAdminController_getCategoryById_shop/v1']>;
export type CategoryAdminController_getCategoryById_Response = OperationResponse<operations['CategoryAdminController_getCategoryById_shop/v1']>;

// Operation: CategoryAdminController_updateCategory_shop/v1
export type CategoryAdminController_updateCategory_Params = OperationParams<operations['CategoryAdminController_updateCategory_shop/v1']>;
export type CategoryAdminController_updateCategory_Request = OperationRequest<operations['CategoryAdminController_updateCategory_shop/v1']>;
export type CategoryAdminController_updateCategory_Response = OperationResponse<operations['CategoryAdminController_updateCategory_shop/v1']>;

// Operation: CategoryAdminController_deleteCategory_shop/v1
export type CategoryAdminController_deleteCategory_Params = OperationParams<operations['CategoryAdminController_deleteCategory_shop/v1']>;
export type CategoryAdminController_deleteCategory_Request = OperationRequest<operations['CategoryAdminController_deleteCategory_shop/v1']>;
export type CategoryAdminController_deleteCategory_Response = OperationResponse<operations['CategoryAdminController_deleteCategory_shop/v1']>;

// Operation: CategoryAdminController_getAllCategoriesInTreeFormat_shop/v1
export type CategoryAdminController_getAllCategoriesInTreeFormat_Params = OperationParams<operations['CategoryAdminController_getAllCategoriesInTreeFormat_shop/v1']>;
export type CategoryAdminController_getAllCategoriesInTreeFormat_Request = OperationRequest<operations['CategoryAdminController_getAllCategoriesInTreeFormat_shop/v1']>;
export type CategoryAdminController_getAllCategoriesInTreeFormat_Response = OperationResponse<operations['CategoryAdminController_getAllCategoriesInTreeFormat_shop/v1']>;

// Operation: CategoryAdminController_getCategoriesBySlug_shop/v1
export type CategoryAdminController_getCategoriesBySlug_Params = OperationParams<operations['CategoryAdminController_getCategoriesBySlug_shop/v1']>;
export type CategoryAdminController_getCategoriesBySlug_Request = OperationRequest<operations['CategoryAdminController_getCategoriesBySlug_shop/v1']>;
export type CategoryAdminController_getCategoriesBySlug_Response = OperationResponse<operations['CategoryAdminController_getCategoriesBySlug_shop/v1']>;

// Operation: ProductAdminController_getProductById_shop/v1
export type ProductAdminController_getProductById_Params = OperationParams<operations['ProductAdminController_getProductById_shop/v1']>;
export type ProductAdminController_getProductById_Request = OperationRequest<operations['ProductAdminController_getProductById_shop/v1']>;
export type ProductAdminController_getProductById_Response = OperationResponse<operations['ProductAdminController_getProductById_shop/v1']>;

// Operation: ProductAdminController_deleteProduct_shop/v1
export type ProductAdminController_deleteProduct_Params = OperationParams<operations['ProductAdminController_deleteProduct_shop/v1']>;
export type ProductAdminController_deleteProduct_Request = OperationRequest<operations['ProductAdminController_deleteProduct_shop/v1']>;
export type ProductAdminController_deleteProduct_Response = OperationResponse<operations['ProductAdminController_deleteProduct_shop/v1']>;

// Operation: ProductAdminController_updateProduct_shop/v1
export type ProductAdminController_updateProduct_Params = OperationParams<operations['ProductAdminController_updateProduct_shop/v1']>;
export type ProductAdminController_updateProduct_Request = OperationRequest<operations['ProductAdminController_updateProduct_shop/v1']>;
export type ProductAdminController_updateProduct_Response = OperationResponse<operations['ProductAdminController_updateProduct_shop/v1']>;

// Operation: ProductAdminController_getAllProducts_shop/v1
export type ProductAdminController_getAllProducts_Params = OperationParams<operations['ProductAdminController_getAllProducts_shop/v1']>;
export type ProductAdminController_getAllProducts_Request = OperationRequest<operations['ProductAdminController_getAllProducts_shop/v1']>;
export type ProductAdminController_getAllProducts_Response = OperationResponse<operations['ProductAdminController_getAllProducts_shop/v1']>;

// Operation: ProductAdminController_createProduct_shop/v1
export type ProductAdminController_createProduct_Params = OperationParams<operations['ProductAdminController_createProduct_shop/v1']>;
export type ProductAdminController_createProduct_Request = OperationRequest<operations['ProductAdminController_createProduct_shop/v1']>;
export type ProductAdminController_createProduct_Response = OperationResponse<operations['ProductAdminController_createProduct_shop/v1']>;

// Operation: ProductAdminController_updateProductStockPrice_shop/v1
export type ProductAdminController_updateProductStockPrice_Params = OperationParams<operations['ProductAdminController_updateProductStockPrice_shop/v1']>;
export type ProductAdminController_updateProductStockPrice_Request = OperationRequest<operations['ProductAdminController_updateProductStockPrice_shop/v1']>;
export type ProductAdminController_updateProductStockPrice_Response = OperationResponse<operations['ProductAdminController_updateProductStockPrice_shop/v1']>;

// Operation: OrderAdminController_getListOfOrders_shop/v1
export type OrderAdminController_getListOfOrders_Params = OperationParams<operations['OrderAdminController_getListOfOrders_shop/v1']>;
export type OrderAdminController_getListOfOrders_Request = OperationRequest<operations['OrderAdminController_getListOfOrders_shop/v1']>;
export type OrderAdminController_getListOfOrders_Response = OperationResponse<operations['OrderAdminController_getListOfOrders_shop/v1']>;

// Operation: OrderAdminController_updateOrderStatus_shop/v1
export type OrderAdminController_updateOrderStatus_Params = OperationParams<operations['OrderAdminController_updateOrderStatus_shop/v1']>;
export type OrderAdminController_updateOrderStatus_Request = OperationRequest<operations['OrderAdminController_updateOrderStatus_shop/v1']>;
export type OrderAdminController_updateOrderStatus_Response = OperationResponse<operations['OrderAdminController_updateOrderStatus_shop/v1']>;

// Operation: OrderAdminController_getOrderById_shop/v1
export type OrderAdminController_getOrderById_Params = OperationParams<operations['OrderAdminController_getOrderById_shop/v1']>;
export type OrderAdminController_getOrderById_Request = OperationRequest<operations['OrderAdminController_getOrderById_shop/v1']>;
export type OrderAdminController_getOrderById_Response = OperationResponse<operations['OrderAdminController_getOrderById_shop/v1']>;

// Operation: OrderAdminController_deleteOrder_shop/v1
export type OrderAdminController_deleteOrder_Params = OperationParams<operations['OrderAdminController_deleteOrder_shop/v1']>;
export type OrderAdminController_deleteOrder_Request = OperationRequest<operations['OrderAdminController_deleteOrder_shop/v1']>;
export type OrderAdminController_deleteOrder_Response = OperationResponse<operations['OrderAdminController_deleteOrder_shop/v1']>;

// Operation: OrderAdminController_getOrderByCode_shop/v1
export type OrderAdminController_getOrderByCode_Params = OperationParams<operations['OrderAdminController_getOrderByCode_shop/v1']>;
export type OrderAdminController_getOrderByCode_Request = OperationRequest<operations['OrderAdminController_getOrderByCode_shop/v1']>;
export type OrderAdminController_getOrderByCode_Response = OperationResponse<operations['OrderAdminController_getOrderByCode_shop/v1']>;

// Operation: PaymentAdminController_getListOfPayments_shop/v1
export type PaymentAdminController_getListOfPayments_Params = OperationParams<operations['PaymentAdminController_getListOfPayments_shop/v1']>;
export type PaymentAdminController_getListOfPayments_Request = OperationRequest<operations['PaymentAdminController_getListOfPayments_shop/v1']>;
export type PaymentAdminController_getListOfPayments_Response = OperationResponse<operations['PaymentAdminController_getListOfPayments_shop/v1']>;

// Operation: PaymentAdminController_capturePayment_shop/v1
export type PaymentAdminController_capturePayment_Params = OperationParams<operations['PaymentAdminController_capturePayment_shop/v1']>;
export type PaymentAdminController_capturePayment_Request = OperationRequest<operations['PaymentAdminController_capturePayment_shop/v1']>;
export type PaymentAdminController_capturePayment_Response = OperationResponse<operations['PaymentAdminController_capturePayment_shop/v1']>;

// Operation: PaymentAdminController_cancelPayment_shop/v1
export type PaymentAdminController_cancelPayment_Params = OperationParams<operations['PaymentAdminController_cancelPayment_shop/v1']>;
export type PaymentAdminController_cancelPayment_Request = OperationRequest<operations['PaymentAdminController_cancelPayment_shop/v1']>;
export type PaymentAdminController_cancelPayment_Response = OperationResponse<operations['PaymentAdminController_cancelPayment_shop/v1']>;

// Operation: PaymentAdminController_refundPayment_shop/v1
export type PaymentAdminController_refundPayment_Params = OperationParams<operations['PaymentAdminController_refundPayment_shop/v1']>;
export type PaymentAdminController_refundPayment_Request = OperationRequest<operations['PaymentAdminController_refundPayment_shop/v1']>;
export type PaymentAdminController_refundPayment_Response = OperationResponse<operations['PaymentAdminController_refundPayment_shop/v1']>;

// Operation: PaymentAdminController_handleMoMoIPN_shop/v1
export type PaymentAdminController_handleMoMoIPN_Params = OperationParams<operations['PaymentAdminController_handleMoMoIPN_shop/v1']>;
export type PaymentAdminController_handleMoMoIPN_Request = OperationRequest<operations['PaymentAdminController_handleMoMoIPN_shop/v1']>;
export type PaymentAdminController_handleMoMoIPN_Response = OperationResponse<operations['PaymentAdminController_handleMoMoIPN_shop/v1']>;

// Operation: PaymentAdminController_getPaymentById_shop/v1
export type PaymentAdminController_getPaymentById_Params = OperationParams<operations['PaymentAdminController_getPaymentById_shop/v1']>;
export type PaymentAdminController_getPaymentById_Request = OperationRequest<operations['PaymentAdminController_getPaymentById_shop/v1']>;
export type PaymentAdminController_getPaymentById_Response = OperationResponse<operations['PaymentAdminController_getPaymentById_shop/v1']>;

// Operation: DashboardAdminController_getOrderStatistics_shop/v1
export type DashboardAdminController_getOrderStatistics_Params = OperationParams<operations['DashboardAdminController_getOrderStatistics_shop/v1']>;
export type DashboardAdminController_getOrderStatistics_Request = OperationRequest<operations['DashboardAdminController_getOrderStatistics_shop/v1']>;
export type DashboardAdminController_getOrderStatistics_Response = OperationResponse<operations['DashboardAdminController_getOrderStatistics_shop/v1']>;

// Operation: DashboardAdminController_getRevenueStatistics_shop/v1
export type DashboardAdminController_getRevenueStatistics_Params = OperationParams<operations['DashboardAdminController_getRevenueStatistics_shop/v1']>;
export type DashboardAdminController_getRevenueStatistics_Request = OperationRequest<operations['DashboardAdminController_getRevenueStatistics_shop/v1']>;
export type DashboardAdminController_getRevenueStatistics_Response = OperationResponse<operations['DashboardAdminController_getRevenueStatistics_shop/v1']>;
