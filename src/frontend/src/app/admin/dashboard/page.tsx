import { IncomeChart } from "@/features/admin/admin-dashboard/components/IncomeChart";
import { BestSellerChart } from "@/features/admin/admin-dashboard/components/BestSellerChart";

export default function DashboardPage()  {
  return (
    <>
    <IncomeChart/>
    <BestSellerChart/>
    </>
  );
}