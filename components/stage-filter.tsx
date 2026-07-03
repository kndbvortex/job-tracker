import Link from "next/link"

import { cn } from "@/lib/utils"
import { applicationStageEnum } from "@/lib/db/schema"
import { STAGE_LABELS } from "@/components/stage-badge"

export function StageFilter({
  activeStage,
  from,
  to,
  search,
}: {
  activeStage?: string
  from?: string
  to?: string
  search?: string
}) {
  const options = [{ value: undefined, label: "All" }, ...applicationStageEnum.enumValues.map((stage) => ({
    value: stage,
    label: STAGE_LABELS[stage],
  }))]

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = activeStage === option.value
        const params = new URLSearchParams()
        if (option.value) params.set("stage", option.value)
        if (from) params.set("from", from)
        if (to) params.set("to", to)
        if (search) params.set("search", search)
        const query = params.toString()
        const href = query ? `/dashboard?${query}` : "/dashboard"
        return (
          <Link
            key={option.label}
            href={href}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
