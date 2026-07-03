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
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const segments = applicationStageEnum.enumValues
    .map((stage) => ({ stage, value: counts[stage] ?? 0 }))
    .filter((segment) => segment.value > 0)

  let cumulative = 0

  return (
    <div
      className={[
        "flex flex-col items-center gap-6 rounded-2xl border border-border p-6 sm:flex-row sm:items-center sm:gap-10",
        "[--chart-saved:#2a78d6] [--chart-applied:#1baf7a] [--chart-interviewing:#eda100] [--chart-offer:#008300] [--chart-rejected:#e34948]",
        "dark:[--chart-saved:#3987e5] dark:[--chart-applied:#199e70] dark:[--chart-interviewing:#c98500] dark:[--chart-offer:#008300] dark:[--chart-rejected:#e66767]",
      ].join(" ")}
    >
      <div className="relative shrink-0">
        <svg width={180} height={180} viewBox="0 0 180 180" className="-rotate-90">
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
              return (
                <circle
                  key={stage}
                  cx={90}
                  cy={90}
                  r={RADIUS}
                  fill="none"
                  stroke={STAGE_COLOR_VARS[stage]}
                  strokeWidth={STROKE}
                  strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                  strokeDashoffset={offset}
                />
              )
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-medium">{total}</p>
          <p className="text-xs text-muted-foreground">Applications</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2">
        {applicationStageEnum.enumValues.map((stage) => {
          const value = counts[stage] ?? 0
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <div key={stage} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: STAGE_COLOR_VARS[stage] }}
                />
                <span className="text-muted-foreground">{STAGE_LABELS[stage]}</span>
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
