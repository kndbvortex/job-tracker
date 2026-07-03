import { Badge } from "@/components/ui/badge"

import type { Application } from "@/lib/db/schema"

const STAGE_LABEL: Record<Application["stage"], string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
}

const STAGE_VARIANT: Record<Application["stage"], "secondary" | "default" | "destructive" | "outline"> = {
  saved: "outline",
  applied: "secondary",
  interviewing: "default",
  offer: "default",
  rejected: "destructive",
}

export function StageBadge({ stage }: { stage: Application["stage"] }) {
  return <Badge variant={STAGE_VARIANT[stage]}>{STAGE_LABEL[stage]}</Badge>
}

export const STAGE_LABELS = STAGE_LABEL
