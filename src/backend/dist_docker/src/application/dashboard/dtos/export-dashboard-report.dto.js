"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportDashboardReportSchema = void 0;
const zod_1 = require("zod");
exports.exportDashboardReportSchema = zod_1.z.object({
    type: zod_1.z.enum(['year', 'month']),
    value: zod_1.z.coerce.number().int().min(1),
    year: zod_1.z.coerce.number().int().min(2000).optional(),
});
//# sourceMappingURL=export-dashboard-report.dto.js.map