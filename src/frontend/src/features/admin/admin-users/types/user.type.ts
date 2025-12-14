import { paths } from "@/lib/open-api-client";
import { AuthAdminController_signUp_Request, AuthAdminController_signUp_Response, UserAdminController_getById_Params, UserAdminController_getById_Response, UserAdminController_getList_Params, UserAdminController_getList_Response, UserAdminController_updateById_Params, UserAdminController_updateById_Request, UserAdminController_updateById_Response } from "@/lib/open-api-client/type.admin";

// Create
export type UserCreateRequest = AuthAdminController_signUp_Request
export type UserCreateResponse = AuthAdminController_signUp_Response['data']

// Get
export type UserGetListParams = UserAdminController_getList_Params
export type UserGetListResponse = UserAdminController_getList_Response['data']

export type UserGetByIdParams = UserAdminController_getById_Params
export type UserGetByIdResponse = UserAdminController_getById_Response['data']

export type User = UserAdminController_getList_Response['data']['items'][number]
export enum EUserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}
// type: "admin" | "staff" | "guest";
export enum EUserType {
  ADMIN = 'admin',
  STAFF = 'staff',
  GUEST = 'guest'
}
// Update
export type UserUpdateParams = UserAdminController_updateById_Params
export type UserUpdateRequest = UserAdminController_updateById_Request
export type UserUpdateResponse = UserAdminController_updateById_Response['data']

// Delete
export type UserDeleteParams = UserAdminController_updateById_Params
export type UserDeleteResponse = UserAdminController_updateById_Response['data']

export type UserErrorResponse = paths['/shop/v1/admin/users']['get']['responses']["4XX"]['content']['application/json'];

