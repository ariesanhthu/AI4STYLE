import { SetMetadata } from "@nestjs/common";
import { EPermission } from "../enums";

export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: EPermission[]) => SetMetadata(PERMISSION_KEY, permissions);
