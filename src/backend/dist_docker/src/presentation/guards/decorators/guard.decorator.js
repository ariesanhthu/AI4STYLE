"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = exports.WEBHOOK_KEY = exports.Permissions = exports.PERMISSION_KEY = exports.Public = exports.PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.PUBLIC_KEY, true);
exports.Public = Public;
exports.PERMISSION_KEY = 'permissions';
const Permissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSION_KEY, permissions);
exports.Permissions = Permissions;
exports.WEBHOOK_KEY = 'isWebhook';
const Webhook = () => (0, common_1.SetMetadata)(exports.WEBHOOK_KEY, true);
exports.Webhook = Webhook;
//# sourceMappingURL=guard.decorator.js.map