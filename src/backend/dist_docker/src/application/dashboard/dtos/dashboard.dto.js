"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardSchema = exports.dashboardItemSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.dashboardItemSchema = zod_1.default.object({
    x: zod_1.default.string(),
    y: zod_1.default.number(),
});
exports.dashboardSchema = zod_1.default.object({
    data: zod_1.default.array(exports.dashboardItemSchema),
    xLabel: zod_1.default.string(),
    yLabel: zod_1.default.string(),
    xType: zod_1.default.string(),
    yType: zod_1.default.string(),
});
//# sourceMappingURL=dashboard.dto.js.map