export function StageRail({
  labels,
}: {
  labels: { saved: string; applied: string; interviewing: string; offer: string }
}) {
  const stages = [labels.saved, labels.applied, labels.interviewing, labels.offer]

  return (
    <div className="flex items-stretch gap-2">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1
        return (
          <div key={stage} className="flex-1">
            <div
              className="h-[3px] w-full rounded-full"
              style={{ backgroundColor: isLast ? "#4F6F52" : "#33415C", opacity: isLast ? 1 : 0.35 + i * 0.2 }}
            />
            <p className="mt-2 font-mono text-[10px] tracking-[0.1em] whitespace-nowrap text-[#6B6558] uppercase">
              <span className="text-[#1B1B18] dark:text-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:inline"> · {stage}</span>
              <span className="sm:hidden"> {stage}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
