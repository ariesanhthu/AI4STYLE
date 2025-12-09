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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { useIncomeAnalys } from "../hooks/use-admin-dashboard"
import { Button, Label } from "@/components/ui"
import { handleDateFormat } from "../utils/formater.util"
import { DatePicker } from "@/components/ui/date-picker"

const chartConfig = {
  y: {
    label: "Income",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function IncomeChart() {
  const { data, range, isLoading, isError, error, select, setSelect, setRange, reFetch } = useIncomeAnalys()

  return (
    <div className="flex justify-center">
      <Card className="w-350">
        <CardHeader className="flex">
          <div>
            <CardTitle>Income</CardTitle>
            <CardDescription className="w-50">January - June 2024</CardDescription>
          </div>

          <div className="flex w-350 justify-end gap-6">
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

        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">

          {isLoading ? (
            <h6>Fetching data...</h6>
          )
            : isError ? (
              <div className="flex flex-col items-center">
                <h6>{error?.message || "Failed to load data"}</h6>
                <Button
                  className="mt-2"
                  variant="outline"
                  size="sm"
                  onClick={reFetch}
                >
                  Retry
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
