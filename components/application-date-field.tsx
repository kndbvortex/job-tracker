"use client"

import { useState } from "react"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ApplicationDateField({ defaultValue }: { defaultValue?: Date }) {
  const [date, setDate] = useState<Date>(defaultValue ?? new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="appliedAt">Application date</Label>
      <input type="hidden" name="appliedAt" value={date.toISOString()} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button id="appliedAt" type="button" variant="outline" className="w-full justify-start font-normal" />
          }
        >
          <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          {format(date, "PPP")}
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            disabled={{ after: new Date() }}
            onSelect={(value) => {
              if (value) {
                setDate(value)
                setOpen(false)
              }
            }}
            classNames={{
              day_button:
                "rounded-full! data-[selected-single=true]:bg-sky-600! data-[selected-single=true]:text-white! data-[selected-single=true]:dark:bg-sky-400! data-[selected-single=true]:group-data-[focused=true]/day:ring-sky-600/20 data-[selected-single=true]:dark:group-data-[focused=true]/day:ring-sky-400/40",
              today: "rounded-full! bg-accent!",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
