import { paths } from "@/lib/open-api-client";
import { RoleAdminController_createRole_Request, RoleAdminController_createRole_Response, RoleAdminController_deleteRole_Params, RoleAdminController_deleteRole_Response, RoleAdminController_getListRoles_Params, RoleAdminController_getListRoles_Response, RoleAdminController_getRoleById_Request, RoleAdminController_getRoleById_Response, RoleAdminController_updateRole_Request, RoleAdminController_updateRole_Response } from "@/lib/open-api-client/type.admin";

// Create
export type RoleCreateRequest = RoleAdminController_createRole_Request;
export type RoleCreateResponse = RoleAdminController_createRole_Response['data'];

// Update
export type RoleUpdateRequest = RoleAdminController_updateRole_Request
export type RoleUpdateResponse = RoleAdminController_updateRole_Response['data'];

// Get
export type RoleGetByIdRequest = RoleAdminController_getRoleById_Request;
export type RoleGetByIdResponse = RoleAdminController_getRoleById_Response['data'];

export type RoleGetAllRequest = RoleAdminController_getListRoles_Params;
export type RoleGetAllResponse = RoleAdminController_getListRoles_Response['data'];

export type PermissionType = RoleGetAllResponse['items'][0]['permissions'][number];

export const PERMISSIONS: PermissionType[] = [
  "CATEGORY_MANAGEMENT",
  "PRODUCT_MANAGEMENT",
  "ORDER_MANAGEMENT",
  "USER_MANAGEMENT",
  "ROLE_MANAGEMENT",
  "DASHBOARD_ACCESS",
  "IMAGE_MANAGEMENT",
]

// Delete
export type RoleDeleteRequest = RoleAdminController_deleteRole_Params['path'];
export type RoleDeleteResponse = RoleAdminController_deleteRole_Response['data'];

export type RoleErrorResponse = paths['/shop/v1/admin/roles/{id}']['delete']['responses']["4XX"]['content']['application/json'];

export type Role = RoleGetAllResponse['items'][0];

export type RoleFormData = {
  name: string;
  description?: string;
  permissions: PermissionType[];
};
