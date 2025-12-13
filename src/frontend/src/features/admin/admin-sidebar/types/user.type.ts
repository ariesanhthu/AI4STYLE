import { paths } from "@/lib/open-api-client";
import { UserClientController_getProfile_Response } from "@/lib/open-api-client/type.client";

export type UserProfileResponse = UserClientController_getProfile_Response['data'];

export type UserPermission = UserClientController_getProfile_Response['data']['role']['permissions'][number];
