"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

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
import { useBestSeller } from "../hooks/use-admin-dashboard"
import { Button } from "@/components/ui"

const chartConfig = {
  y: {
    label: "Đã bán",
  },
} satisfies ChartConfig

export function BestSellerChart({ range, select }: { range: { start: Date | undefined, end: Date | undefined }, select: string }) {
  const { data, isLoading, error, isError, reFetch } = useBestSeller(range, select)

  const chartData = data.map((item, index) => {
    const colorIndex = (index % 5) + 1
    return {
      ...item,
      fill: `var(--chart-${colorIndex})`,
    }
  })

  return (
    <div className="flex justify-center mt-6">
      <Card className="w-350">
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
          <CardDescription>Thống kê sản phẩm</CardDescription>
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
                <ChartContainer className="w-full h-full" config={chartConfig}>
                  <BarChart
                    accessibilityLayer
                    data={chartData}
                    layout="vertical"
                    margin={{
                      left: 10,
                      right: 16
                    }}
                  >
                    <YAxis
                      width={70}
                      dataKey="x"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    />
                    <XAxis dataKey="y" type="number" hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar dataKey="y" layout="vertical" radius={5}>
                      <LabelList
                        dataKey="y"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
        </CardContent>
      </Card>
    </div>
  )
}
