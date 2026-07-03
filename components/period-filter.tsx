"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { endOfMonth, format, startOfMonth, subDays, subMonths } from "date-fns"
import type { DateRange } from "react-day-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const presets = [
  { label: "Last 7 days", range: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", range: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "This month", range: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  {
    label: "Last month",
    range: () => ({
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    }),
  },
]

export function PeriodFilter({ from, to }: { from?: string; to?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const range: DateRange | undefined = from
    ? { from: new Date(from), to: to ? new Date(to) : new Date(from) }
    : undefined

  function apply(next: DateRange | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (next?.from) {
      params.set("from", format(next.from, "yyyy-MM-dd"))
      params.set("to", format(next.to ?? next.from, "yyyy-MM-dd"))
    } else {
      params.delete("from")
      params.delete("to")
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  const label = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
      : format(range.from, "MMM d, yyyy")
    : "All time"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" className="font-normal" />}>
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
        {label}
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex">
          <Calendar
            mode="range"
            selected={range}
            defaultMonth={range?.from}
            onSelect={(value) => {
              if (value?.from) apply(value)
            }}
            classNames={{
              range_start: "bg-sky-600/20 dark:bg-sky-400/10 rounded-l-full",
              range_end: "bg-sky-600/20 dark:bg-sky-400/10 rounded-r-full",
              day_button:
                "data-[range-end=true]:rounded-full! data-[range-start=true]:rounded-full! data-[range-start=true]:bg-sky-600! data-[range-start=true]:text-white! data-[range-start=true]:dark:bg-sky-400! data-[range-start=true]:group-data-[focused=true]/day:ring-sky-600/20 data-[range-start=true]:dark:group-data-[focused=true]/day:ring-sky-400/40 data-[range-end=true]:bg-sky-600! data-[range-end=true]:text-white! data-[range-end=true]:dark:bg-sky-400! data-[range-end=true]:group-data-[focused=true]/day:ring-sky-600/20 data-[range-end=true]:dark:group-data-[focused=true]/day:ring-sky-400/40 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-sky-600/20 data-[range-middle=true]:dark:bg-sky-400/10 hover:rounded-full",
              today:
                "data-[selected=true]:rounded-l-none! rounded-full bg-accent! data-[selected=true]:bg-sky-600/20! dark:data-[selected=true]:bg-sky-400/10! [&_button[data-range-middle=true]]:bg-transparent!",
            }}
          />
          <div className="flex flex-col gap-1 border-l border-border p-3">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => {
                apply(undefined)
                setOpen(false)
              }}
            >
              All time
            </Button>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  apply(preset.range())
                  setOpen(false)
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
