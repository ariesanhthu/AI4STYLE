import { paths } from "@/lib/open-api-client";

// Types from OpenAPI schema
export type SignInDto = paths["/shop/v1/admin/auth/sign-in"]["post"]["requestBody"]["content"]["application/json"];

export type SignInResponse = paths["/shop/v1/admin/auth/sign-in"]["post"]["responses"][201]["content"]["application/json"];