import { paths } from "@/lib/open-api-client";
import {
  DashboardAdminController_getOrderStatistics_Params,
  DashboardAdminController_getOrderStatistics_Response,
  DashboardAdminController_getOrderStatistics_Request,
  DashboardAdminController_getRevenueStatistics_Params,
  DashboardAdminController_getRevenueStatistics_Response,
  DashboardAdminController_getRevenueStatistics_Request,
} from "@/lib/open-api-client/type.admin";

export type DashBoardIncomeResponse = DashboardAdminController_getRevenueStatistics_Response['data'];
export type DashBoardIncomeParamsQuery = DashboardAdminController_getRevenueStatistics_Params['query'];
export type DashBoardIncomeRequest = DashboardAdminController_getRevenueStatistics_Request;