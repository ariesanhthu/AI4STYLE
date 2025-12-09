'use client'

import { IncomeChart } from "@/features/admin/admin-dashboard/components/IncomeChart";
import { BestSellerChart } from "@/features/admin/admin-dashboard/components/BestSellerChart";
import { DatePicker } from "@/components/ui/date-picker";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Label } from "@/components/ui"
import { useDashBoard } from "../hooks/use-admin-dashboard"

export default function DashboardPage() {
  const { range, select, setRange, setSelect } = useDashBoard()
  
  return (
    <>
      <div className="flex w-350 justify-end gap-6 mb-3">
        <DatePicker label="Start Date" onChange={(date) => setRange({ ...range, start: date })} date={range.start} />
        <DatePicker label="End Date" onChange={(date) => setRange({ ...range, end: date })} date={range.end} />

        <div className="flex flex-col gap-3">
          <Label className="px-1">
            Date By
          </Label>
          <Select onValueChange={(value) => setSelect(value as string)} value={select}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"date"} value={"day"}>
                Date
              </SelectItem>
              <SelectItem key={"month"} value={"month"}>
                Month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <IncomeChart range={range} select={select}/>
      <BestSellerChart range={range} select={select}/>
    </>
  );
}