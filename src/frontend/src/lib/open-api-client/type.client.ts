import { operations } from './open-api';

// Helper types to extract Request and Response bodies
export type OperationRequest<T> = T extends { requestBody?: { content: { 'application/json': infer R } } } ? R : never;
export type OperationResponse<T> = T extends { responses: { 200: { content: { 'application/json': infer R } } } } ? R : T extends { responses: { 201: { content: { 'application/json': infer R } } } } ? R : never;

// Operation: HealthController_check_shop/v1
export type HealthController_check_Params = operations['HealthController_check_shop/v1']['parameters'];
export type HealthController_check_Request = OperationRequest<operations['HealthController_check_shop/v1']>;
export type HealthController_check_Response = OperationResponse<operations['HealthController_check_shop/v1']>;

// Operation: UserClientController_getProfile_shop/v1
export type UserClientController_getProfile_Params = operations['UserClientController_getProfile_shop/v1']['parameters'];
export type UserClientController_getProfile_Request = OperationRequest<operations['UserClientController_getProfile_shop/v1']>;
export type UserClientController_getProfile_Response = OperationResponse<operations['UserClientController_getProfile_shop/v1']>;

// Operation: UserClientController_updateProfile_shop/v1
export type UserClientController_updateProfile_Params = operations['UserClientController_updateProfile_shop/v1']['parameters'];
export type UserClientController_updateProfile_Request = OperationRequest<operations['UserClientController_updateProfile_shop/v1']>;
export type UserClientController_updateProfile_Response = OperationResponse<operations['UserClientController_updateProfile_shop/v1']>;

// Operation: AuthClientController_signUp_shop/v1
export type AuthClientController_signUp_Params = operations['AuthClientController_signUp_shop/v1']['parameters'];
export type AuthClientController_signUp_Request = OperationRequest<operations['AuthClientController_signUp_shop/v1']>;
export type AuthClientController_signUp_Response = OperationResponse<operations['AuthClientController_signUp_shop/v1']>;

// Operation: AuthClientController_signIn_shop/v1
export type AuthClientController_signIn_Params = operations['AuthClientController_signIn_shop/v1']['parameters'];
export type AuthClientController_signIn_Request = OperationRequest<operations['AuthClientController_signIn_shop/v1']>;
export type AuthClientController_signIn_Response = OperationResponse<operations['AuthClientController_signIn_shop/v1']>;

// Operation: AuthClientController_signOut_shop/v1
export type AuthClientController_signOut_Params = operations['AuthClientController_signOut_shop/v1']['parameters'];
export type AuthClientController_signOut_Request = OperationRequest<operations['AuthClientController_signOut_shop/v1']>;
export type AuthClientController_signOut_Response = OperationResponse<operations['AuthClientController_signOut_shop/v1']>;

// Operation: AuthClientController_changePassword_shop/v1
export type AuthClientController_changePassword_Params = operations['AuthClientController_changePassword_shop/v1']['parameters'];
export type AuthClientController_changePassword_Request = OperationRequest<operations['AuthClientController_changePassword_shop/v1']>;
export type AuthClientController_changePassword_Response = OperationResponse<operations['AuthClientController_changePassword_shop/v1']>;

// Operation: AuthClientController_forgetPassword_shop/v1
export type AuthClientController_forgetPassword_Params = operations['AuthClientController_forgetPassword_shop/v1']['parameters'];
export type AuthClientController_forgetPassword_Request = OperationRequest<operations['AuthClientController_forgetPassword_shop/v1']>;
export type AuthClientController_forgetPassword_Response = OperationResponse<operations['AuthClientController_forgetPassword_shop/v1']>;

// Operation: AuthClientController_refreshToken_shop/v1
export type AuthClientController_refreshToken_Params = operations['AuthClientController_refreshToken_shop/v1']['parameters'];
export type AuthClientController_refreshToken_Request = OperationRequest<operations['AuthClientController_refreshToken_shop/v1']>;
export type AuthClientController_refreshToken_Response = OperationResponse<operations['AuthClientController_refreshToken_shop/v1']>;

// Operation: AuthClientController_requestOtp_shop/v1
export type AuthClientController_requestOtp_Params = operations['AuthClientController_requestOtp_shop/v1']['parameters'];
export type AuthClientController_requestOtp_Request = OperationRequest<operations['AuthClientController_requestOtp_shop/v1']>;
export type AuthClientController_requestOtp_Response = OperationResponse<operations['AuthClientController_requestOtp_shop/v1']>;

// Operation: AuthClientController_verifyOtp_shop/v1
export type AuthClientController_verifyOtp_Params = operations['AuthClientController_verifyOtp_shop/v1']['parameters'];
export type AuthClientController_verifyOtp_Request = OperationRequest<operations['AuthClientController_verifyOtp_shop/v1']>;
export type AuthClientController_verifyOtp_Response = OperationResponse<operations['AuthClientController_verifyOtp_shop/v1']>;

// Operation: CategoryClientController_getCategoryById_shop/v1
export type CategoryClientController_getCategoryById_Params = operations['CategoryClientController_getCategoryById_shop/v1']['parameters'];
export type CategoryClientController_getCategoryById_Request = OperationRequest<operations['CategoryClientController_getCategoryById_shop/v1']>;
export type CategoryClientController_getCategoryById_Response = OperationResponse<operations['CategoryClientController_getCategoryById_shop/v1']>;

// Operation: CategoryClientController_getAllCategoriesInTreeFormat_shop/v1
export type CategoryClientController_getAllCategoriesInTreeFormat_Params = operations['CategoryClientController_getAllCategoriesInTreeFormat_shop/v1']['parameters'];
export type CategoryClientController_getAllCategoriesInTreeFormat_Request = OperationRequest<operations['CategoryClientController_getAllCategoriesInTreeFormat_shop/v1']>;
export type CategoryClientController_getAllCategoriesInTreeFormat_Response = OperationResponse<operations['CategoryClientController_getAllCategoriesInTreeFormat_shop/v1']>;

// Operation: CategoryClientController_getCategoriesBySlug_shop/v1
export type CategoryClientController_getCategoriesBySlug_Params = operations['CategoryClientController_getCategoriesBySlug_shop/v1']['parameters'];
export type CategoryClientController_getCategoriesBySlug_Request = OperationRequest<operations['CategoryClientController_getCategoriesBySlug_shop/v1']>;
export type CategoryClientController_getCategoriesBySlug_Response = OperationResponse<operations['CategoryClientController_getCategoriesBySlug_shop/v1']>;

// Operation: ProductClientController_getAllProductOptions_shop/v1
export type ProductClientController_getAllProductOptions_Params = operations['ProductClientController_getAllProductOptions_shop/v1']['parameters'];
export type ProductClientController_getAllProductOptions_Request = OperationRequest<operations['ProductClientController_getAllProductOptions_shop/v1']>;
export type ProductClientController_getAllProductOptions_Response = OperationResponse<operations['ProductClientController_getAllProductOptions_shop/v1']>;

// Operation: ProductClientController_getProductOptionById_shop/v1
export type ProductClientController_getProductOptionById_Params = operations['ProductClientController_getProductOptionById_shop/v1']['parameters'];
export type ProductClientController_getProductOptionById_Request = OperationRequest<operations['ProductClientController_getProductOptionById_shop/v1']>;
export type ProductClientController_getProductOptionById_Response = OperationResponse<operations['ProductClientController_getProductOptionById_shop/v1']>;

// Operation: OrderClientController_createOrder_shop/v1
export type OrderClientController_createOrder_Params = operations['OrderClientController_createOrder_shop/v1']['parameters'];
export type OrderClientController_createOrder_Request = OperationRequest<operations['OrderClientController_createOrder_shop/v1']>;
export type OrderClientController_createOrder_Response = OperationResponse<operations['OrderClientController_createOrder_shop/v1']>;

// Operation: OrderClientController_getMyOrders_shop/v1
export type OrderClientController_getMyOrders_Params = operations['OrderClientController_getMyOrders_shop/v1']['parameters'];
export type OrderClientController_getMyOrders_Request = OperationRequest<operations['OrderClientController_getMyOrders_shop/v1']>;
export type OrderClientController_getMyOrders_Response = OperationResponse<operations['OrderClientController_getMyOrders_shop/v1']>;

// Operation: OrderClientController_getOrderById_shop/v1
export type OrderClientController_getOrderById_Params = operations['OrderClientController_getOrderById_shop/v1']['parameters'];
export type OrderClientController_getOrderById_Request = OperationRequest<operations['OrderClientController_getOrderById_shop/v1']>;
export type OrderClientController_getOrderById_Response = OperationResponse<operations['OrderClientController_getOrderById_shop/v1']>;

// Operation: OrderClientController_getOrderByCode_shop/v1
export type OrderClientController_getOrderByCode_Params = operations['OrderClientController_getOrderByCode_shop/v1']['parameters'];
export type OrderClientController_getOrderByCode_Request = OperationRequest<operations['OrderClientController_getOrderByCode_shop/v1']>;
export type OrderClientController_getOrderByCode_Response = OperationResponse<operations['OrderClientController_getOrderByCode_shop/v1']>;

// Operation: PaymentMethodClientController_getAllPaymentMethods_shop/v1
export type PaymentMethodClientController_getAllPaymentMethods_Params = operations['PaymentMethodClientController_getAllPaymentMethods_shop/v1']['parameters'];
export type PaymentMethodClientController_getAllPaymentMethods_Request = OperationRequest<operations['PaymentMethodClientController_getAllPaymentMethods_shop/v1']>;
export type PaymentMethodClientController_getAllPaymentMethods_Response = OperationResponse<operations['PaymentMethodClientController_getAllPaymentMethods_shop/v1']>;

// Operation: PaymentClientController_createPayment_shop/v1
export type PaymentClientController_createPayment_Params = operations['PaymentClientController_createPayment_shop/v1']['parameters'];
export type PaymentClientController_createPayment_Request = OperationRequest<operations['PaymentClientController_createPayment_shop/v1']>;
export type PaymentClientController_createPayment_Response = OperationResponse<operations['PaymentClientController_createPayment_shop/v1']>;

// Operation: PaymentClientController_getPaymentById_shop/v1
export type PaymentClientController_getPaymentById_Params = operations['PaymentClientController_getPaymentById_shop/v1']['parameters'];
export type PaymentClientController_getPaymentById_Request = OperationRequest<operations['PaymentClientController_getPaymentById_shop/v1']>;
export type PaymentClientController_getPaymentById_Response = OperationResponse<operations['PaymentClientController_getPaymentById_shop/v1']>;
