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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { analysService } from "../services/admin-dashboard.service";
import { toast } from "sonner";
import { Download } from "lucide-react";

export default function DashboardPage() {
  const { range, select, setRange, setSelect } = useDashBoard()

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportType, setExportType] = useState<'year' | 'month'>('year');
  const [exportYear, setExportYear] = useState<number>(new Date().getFullYear());
  const [exportValue, setExportValue] = useState<number>(new Date().getFullYear()); // Represents year or month value
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Logic adjustment: 
      // API expects: type (year/month), value (the main value), year (context year)
      // If type=year: value=2024, year=2024 (redundant but likely same)
      // If type=month: value=10, year=2024

      const valueToSend = exportType === 'year' ? exportYear : exportValue;

      await analysService.exportReport({
        type: exportType,
        value: valueToSend,
        year: exportYear
      });
      toast.success("Xuất báo cáo thành công");
      setIsExportOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Xuất báo cáo thất bại");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Thống kê</h1>
        <div className="flex items-center gap-4">
          {/* Date Pickers & Range Select */}
          <div className="flex items-center gap-4">
            <DatePicker label="Ngày bắt đầu" onChange={(date) => setRange({ ...range, start: date })} date={range.start} />
            <DatePicker label="Ngày kết thúc" onChange={(date) => setRange({ ...range, end: date })} date={range.end} />

            <Select onValueChange={(value) => setSelect(value as string)} value={select}>
              <SelectTrigger className="w-[180px] mt-6">
                <SelectValue placeholder="Chọn phạm vi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={"date"} value={"day"}>
                  Ngày
                </SelectItem>
                <SelectItem key={"month"} value={"month"}>
                  Tháng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 mt-6 mr-14">
                <Download className="h-4 w-4" />
                Xuất báo cáo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Xuất báo cáo</DialogTitle>
                <DialogDescription>
                  Chọn loại báo cáo bạn muốn xuất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Loại
                  </Label>
                  <Select
                    value={exportType}
                    onValueChange={(val: 'year' | 'month') => {
                      setExportType(val);
                      // Reset value if switching types
                      if (val === 'month') setExportValue(new Date().getMonth() + 1);
                      else setExportValue(editYear => editYear); // If year, value is just year
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Báo cáo năm</SelectItem>
                      <SelectItem value="month">Báo cáo tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">
                    Năm
                  </Label>
                  <Input
                    type="number"
                    value={exportYear}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setExportYear(val);
                      // If type is year, also update value
                      if (exportType === 'year') setExportValue(val);
                    }}
                    className="col-span-3"
                  />
                </div>

                {exportType === 'month' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Tháng
                    </Label>
                    <Select
                      value={exportValue.toString()}
                      onValueChange={(val) => setExportValue(parseInt(val))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn tháng" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <SelectItem key={m} value={m.toString()}>
                            Tháng {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "Đang xuất..." : "Xuất"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <IncomeChart range={range} select={select} />
      <BestSellerChart range={range} select={select} />
    </>
  );
}