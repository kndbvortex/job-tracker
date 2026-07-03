import type { ReactNode } from "react"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  Calling02Icon,
  ChampionIcon,
} from "@hugeicons/core-free-icons"

import { StageBadge } from "@/components/stage-badge"

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 md:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <Image
          src="/login.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <div className="relative flex h-full flex-col justify-end gap-8 p-16 text-white">
          <div className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-5" />
            </div>
            <h2 className="text-2xl font-medium">Track every application, in one place</h2>
            <p className="max-w-sm text-sm text-white/70">
              Save roles you&apos;re interested in, follow up at the right time, and see your
              pipeline at a glance.
            </p>
          </div>

          <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
            <p className="text-xs text-white/60">Your pipeline</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { company: "Acme Corp", role: "Senior Engineer", stage: "interviewing" as const },
                { company: "Globex", role: "Product Designer", stage: "applied" as const },
                { company: "Initech", role: "Staff Engineer", stage: "offer" as const },
              ].map((row) => (
                <div
                  key={row.company}
                  className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">{row.company}</p>
                    <p className="text-xs text-white/60">{row.role}</p>
                  </div>
                  <StageBadge stage={row.stage} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 text-xs text-white/60">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4" />
              Track every stage
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Calling02Icon} strokeWidth={2} className="size-4" />
              Never miss a follow-up
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={ChampionIcon} strokeWidth={2} className="size-4" />
              Land the offer
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
