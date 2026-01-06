"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useIncomeAnalys } from "../hooks/use-admin-dashboard"
import { Button } from "@/components/ui"
import { handleDateFormat } from "../utils/formater.util"

const chartConfig = {
  y: {
    label: "Doanh thu",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function IncomeChart({ range, select }: { range: { start: Date | undefined, end: Date | undefined }, select: string }) {
  const { data, isLoading, isError, error, reFetch } = useIncomeAnalys(range, select)

  return (
    <div className="flex justify-center">
      <Card className="w-350">
        <CardHeader className="flex">
          <div>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription className="w-50">Thống kê doanh thu</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">

          {isLoading ? (
            <h6>Đang tải dữ liệu...</h6>
          )
            : isError ? (
              <div className="flex flex-col items-center">
                <h6>{error?.message || "Tải dữ liệu thất bại"}</h6>
                <Button
                  className="mt-2"
                  variant="outline"
                  size="sm"
                  onClick={reFetch}
                >
                  Thử lại
                </Button>
              </div>
            )
              : (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                      left: 20,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="x"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => handleDateFormat(value, select)}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="y"
                      type="linear"
                      stroke="var(--color-y)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              )
          }


        </CardContent>
      </Card>
    </div>
  )
}
