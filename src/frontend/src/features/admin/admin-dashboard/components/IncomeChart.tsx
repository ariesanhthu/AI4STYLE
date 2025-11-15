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

import { DateType, dateTypes, useDataAnalys } from "../hooks/use-admin-dashboard"
import { Button } from "@/components/ui"
import { handleDateFormat } from "../utils/formater.util"

const chartConfig = {
  desktop: {
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function IncomeChart() {
  const { data, isLoading, isError, error, select, setSelect, reFetch } = useDataAnalys()

  return (
    <div className="flex flex-col gap-4">

      <div className="flex justify-center">
        <Card className="w-350">
          <CardHeader className="flex">
            <div>
              <CardTitle>Income</CardTitle>
              <CardDescription className="w-50">January - June 2024</CardDescription>
            </div>

            <div className="flex w-350 justify-end">
              <Select onValueChange={(value) => setSelect(value as DateType)} value={select}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {dateTypes.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d[0].toUpperCase() + d.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        dataKey="time"
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
                        dataKey="value"
                        type="linear"
                        stroke="var(--color-desktop)"
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
    </div>
  )
}
