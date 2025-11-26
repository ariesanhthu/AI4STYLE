import { SetMetadata } from '@nestjs/common';
import { EPermission } from '@/shared/enums';

export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const PERMISSION_KEY = 'permissions';
export const Permissions = (...permissions: EPermission[]) =>
  SetMetadata(PERMISSION_KEY, permissions);

export const WEBHOOK_KEY = 'isWebhook';
export const Webhook = () => SetMetadata(WEBHOOK_KEY, true);
