import { paths } from "@/lib/open-api-client";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  ok: boolean;
  error?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export type SignInRequestDto = paths['/shop/v1/client/auth/sign-in']['post']['requestBody']['content']['application/json'];
export type SignInResponseDto = paths['/shop/v1/client/auth/sign-in']['post']['responses']['201']['content']['application/json']['data'];
export type SignUpRequestDto = paths['/shop/v1/client/auth/sign-up']['post']['requestBody']['content']['application/json'];
export type ProfileResponse = paths['/shop/v1/client/users/profile']['get']['responses']['200']['content']['application/json']['data'];
