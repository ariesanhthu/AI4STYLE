import { AuthClientController_changePassword_Request, AuthClientController_changePassword_Response, AuthClientController_forgetPassword_Request, AuthClientController_forgetPassword_Response, AuthClientController_signIn_Request, AuthClientController_signIn_Response, AuthClientController_signUp_Request, AuthClientController_signUp_Response } from "@/lib/open-api-client/type.client";

export type SignInRequest = AuthClientController_signIn_Request;
export type SignInResponse = AuthClientController_signIn_Response["data"];

export type SignUpRequest = AuthClientController_signUp_Request;
export type SignUpResponse = AuthClientController_signUp_Response["data"];

export type ForgotPasswordRequest = AuthClientController_forgetPassword_Request;
export type ForgotPasswordResponse = AuthClientController_forgetPassword_Response["data"];

export type ChangePasswordRequest = AuthClientController_changePassword_Request;
export type ChangePasswordResponse = AuthClientController_changePassword_Response["data"];
