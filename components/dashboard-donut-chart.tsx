"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { applicationStageEnum } from "@/lib/db/schema"
import { STAGE_LABELS } from "@/components/stage-badge"

const STAGE_COLOR_VARS: Record<(typeof applicationStageEnum.enumValues)[number], string> = {
  saved: "var(--chart-saved)",
  applied: "var(--chart-applied)",
  interviewing: "var(--chart-interviewing)",
  offer: "var(--chart-offer)",
  rejected: "var(--chart-rejected)",
}

const RADIUS = 70
const STROKE = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 4

export function DashboardDonutChart({ counts }: { counts: Record<string, number> }) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeStage = searchParams.get("stage")

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const segments = applicationStageEnum.enumValues
    .map((stage) => ({ stage, value: counts[stage] ?? 0 }))
    .filter((segment) => segment.value > 0)

  function handleClick(stage: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (activeStage === stage) {
      params.delete("stage")
    } else {
      params.set("stage", stage)
    }
    router.push(`/dashboard?${params.toString()}`)
  }

  let cumulative = 0

  const displayStage = (hoveredStage ?? activeStage) as (typeof applicationStageEnum.enumValues)[number] | null
  const displayValue = displayStage ? (counts[displayStage] ?? 0) : total
  const displayLabel = displayStage ? STAGE_LABELS[displayStage] : "Total"

  return (
    <div
      className={[
        "flex flex-col items-center gap-6 rounded-2xl border border-border p-6 sm:flex-row sm:items-center sm:gap-10",
        "[--chart-saved:#4AAFFD] [--chart-applied:#1baf7a] [--chart-interviewing:#eda100] [--chart-offer:#008300] [--chart-rejected:#e34948]",
        "dark:[--chart-saved:#4AAFFD] dark:[--chart-applied:#199e70] dark:[--chart-interviewing:#c98500] dark:[--chart-offer:#008300] dark:[--chart-rejected:#e66767]",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <svg
          width={180}
          height={180}
          viewBox="0 0 180 180"
          className="-rotate-90"
          style={{ overflow: "visible" }}
        >
          <circle
            cx={90}
            cy={90}
            r={RADIUS}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={STROKE}
          />
          {total > 0 &&
            segments.map(({ stage, value }) => {
              const length = Math.max((value / total) * CIRCUMFERENCE - GAP, 0)
              const offset = -cumulative
              cumulative += (value / total) * CIRCUMFERENCE
              const isHovered = hoveredStage === stage
              const isActive = activeStage === stage
              const isDimmed = (hoveredStage !== null && !isHovered) || (activeStage !== null && !isActive && hoveredStage === null)
              return (
                <circle
                  key={stage}
                  cx={90}
                  cy={90}
                  r={RADIUS}
                  fill="none"
                  stroke={STAGE_COLOR_VARS[stage as (typeof applicationStageEnum.enumValues)[number]]}
                  strokeWidth={isHovered || isActive ? STROKE + 6 : STROKE}
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={offset}
                  style={{
                    opacity: isDimmed ? 0.3 : 1,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  onClick={() => handleClick(stage)}
                />
              )
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-all duration-200">
          <p className="text-3xl font-medium">{displayValue}</p>
          <p className="text-xs text-muted-foreground">{displayLabel}</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {applicationStageEnum.enumValues.map((stage) => {
          const value = counts[stage] ?? 0
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          const isHovered = hoveredStage === stage
          const isActive = activeStage === stage
          const isDimmed = (hoveredStage !== null && !isHovered) || (activeStage !== null && !isActive && hoveredStage === null)
          return (
            <div
              key={stage}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2 py-1 text-sm transition-all duration-150"
              style={{
                opacity: isDimmed ? 0.35 : 1,
                backgroundColor: isActive || isHovered ? "var(--muted)" : "transparent",
                transform: isHovered || isActive ? "translateX(2px)" : "none",
              }}
              onMouseEnter={() => setHoveredStage(stage)}
              onMouseLeave={() => setHoveredStage(null)}
              onClick={() => handleClick(stage)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full transition-all duration-150"
                  style={{
                    backgroundColor: STAGE_COLOR_VARS[stage],
                    transform: isHovered || isActive ? "scale(1.4)" : "scale(1)",
                  }}
                />
                <span className={isHovered || isActive ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              <span className="font-medium">
                {value} <span className="text-muted-foreground">({pct}%)</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
