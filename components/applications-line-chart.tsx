"use client"

import { useMemo } from "react"
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  differenceInCalendarDays,
  format,
  isSameDay,
  isSameHour,
  isSameMonth,
} from "date-fns"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useLocale } from "@/components/locale-provider"

type Granularity = "hour" | "day" | "month"

function pickGranularity(from: Date, to: Date): Granularity {
  const days = differenceInCalendarDays(to, from)
  if (days > 60) return "month"
  if (days > 2) return "day"
  return "hour"
}

function buildBuckets(from: Date, to: Date, granularity: Granularity, dates: Date[]) {
  if (granularity === "month") {
    return eachMonthOfInterval({ start: from, end: to }).map((bucketDate) => ({
      date: bucketDate,
      label: format(bucketDate, "MMM yyyy"),
      count: dates.filter((d) => isSameMonth(d, bucketDate)).length,
    }))
  }

  if (granularity === "day") {
    return eachDayOfInterval({ start: from, end: to }).map((bucketDate) => ({
      date: bucketDate,
      label: format(bucketDate, "MMM d"),
      count: dates.filter((d) => isSameDay(d, bucketDate)).length,
    }))
  }

  return eachHourOfInterval({ start: from, end: to }).map((bucketDate) => ({
    date: bucketDate,
    label: format(bucketDate, "ha"),
    count: dates.filter((d) => isSameHour(d, bucketDate)).length,
  }))
}

export function ApplicationsLineChart({ dates, from, to }: { dates: Date[]; from: Date; to: Date }) {
  const { dictionary } = useLocale()
  const d = dictionary.dashboard

  const { data, total, granularity } = useMemo(() => {
    const granularity = pickGranularity(from, to)
    const inRange = dates.filter((d) => d >= from && d <= to)
    return {
      data: buildBuckets(from, to, granularity, dates),
      total: inRange.length,
      granularity,
    }
  }, [dates, from, to])

  const byLabel = granularity === "hour" ? d.byHour : granularity === "day" ? d.byDay : d.byMonth

  const chartConfig = {
    count: {
      label: d.applications,
      color: "#2a78d6",
    },
  } satisfies ChartConfig

  return (
    <div className="rounded-2xl border border-border p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{d.applicationsOverTime}</p>
          <p className="text-2xl font-medium">{total}</p>
        </div>
        <p className="text-xs text-muted-foreground">{byLabel}</p>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-52 w-full">
        <LineChart data={data} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line dataKey="count" type="monotone" stroke="var(--color-count)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
