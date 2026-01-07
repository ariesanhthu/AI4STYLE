"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStatsSchema = void 0;
const zod_1 = require("zod");
exports.getDashboardStatsSchema = zod_1.z.object({
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
    groupBy: zod_1.z.enum(['day', 'month']),
    year: zod_1.z.coerce.number().optional(),
}).refine((data) => {
    if (data.groupBy === 'month' && !data.year) {
        return false;
    }
    return true;
}, {
    message: "Year is required when groupBy is 'month'",
    path: ['year'],
});
const getDashboardStatsSchemaTransform = exports.getDashboardStatsSchema.transform((data) => {
    return {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
});
//# sourceMappingURL=get-dashboard-stats.dto.js.map