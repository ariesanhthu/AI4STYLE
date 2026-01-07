import { EPermission } from '@/shared/enums';
export declare const PUBLIC_KEY = "isPublic";
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const PERMISSION_KEY = "permissions";
export declare const Permissions: (...permissions: EPermission[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const WEBHOOK_KEY = "isWebhook";
export declare const Webhook: () => import("@nestjs/common").CustomDecorator<string>;
