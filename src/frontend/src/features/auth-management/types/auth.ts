import { paths } from "@/lib/open-api-client";
import { AuthClientController_changePassword_Request, AuthClientController_changePassword_Response, AuthClientController_forgetPassword_Request, AuthClientController_forgetPassword_Response, AuthClientController_refreshToken_Request, AuthClientController_refreshToken_Response, AuthClientController_signIn_Request, AuthClientController_signIn_Response, AuthClientController_signOut_Request, AuthClientController_signOut_Response, AuthClientController_signUp_Request, AuthClientController_signUp_Response, UserClientController_getProfile_Request, UserClientController_getProfile_Response, UserClientController_updateProfile_Request } from "@/lib/open-api-client/type.client";

export type SignInRequest = AuthClientController_signIn_Request;
export type SignInResponse = AuthClientController_signIn_Response["data"];

export type SignUpRequest = AuthClientController_signUp_Request;
export type SignUpResponse = AuthClientController_signUp_Response["data"];

export type ForgotPasswordRequest = AuthClientController_forgetPassword_Request;
export type ForgotPasswordResponse = AuthClientController_forgetPassword_Response["data"];

export type ChangePasswordRequest = AuthClientController_changePassword_Request;
export type ChangePasswordResponse = AuthClientController_changePassword_Response["data"];

export type RefreshTokenRequest = AuthClientController_refreshToken_Request;
export type RefreshTokenResponse = AuthClientController_refreshToken_Response["data"];

export type SignOutRequest = AuthClientController_signOut_Request;
export type SignOutResponse = AuthClientController_signOut_Response["data"];

export type ProfileRequest = UserClientController_getProfile_Request;
export type ProfileResponse = UserClientController_getProfile_Response["data"];

export type UpdateProfileRequest = UserClientController_updateProfile_Request

export type User = ProfileResponse

export type ErrorResponse = paths['/shop/v1/client/users/profile']['get']['responses']['4XX']['content']['application/json']