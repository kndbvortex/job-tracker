"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Image01Icon, LinkSquare01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function JobSnapshotDialog({
  company,
  snapshotUrl,
  snapshotPageUrl,
}: {
  company: string
  snapshotUrl: string
  snapshotPageUrl: string | null
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm">
            <HugeiconsIcon icon={Image01Icon} strokeWidth={2} />
            <span className="sr-only">View job posting snapshot</span>
          </Button>
        }
      />
      <DialogContent className="h-[96vh] max-h-[96vh] w-[96vw] max-w-[96vw] grid-rows-[auto_minmax(0,1fr)_auto]">
        <DialogHeader>
          <DialogTitle>{company}: saved posting</DialogTitle>
          <DialogDescription>
            Captured automatically when this application was saved, in case the listing gets
            taken down.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={snapshotUrl} alt={`Saved job posting for ${company}`} className="w-full" />
        </div>
        <DialogFooter className="sm:justify-start">
          <Button variant="outline" render={<a href={snapshotUrl} target="_blank" rel="noreferrer" />} nativeButton={false}>
            <HugeiconsIcon icon={LinkSquare01Icon} strokeWidth={2} />
            Open image in new tab
          </Button>
          {snapshotPageUrl && (
            <Button variant="outline" render={<a href={snapshotPageUrl} target="_blank" rel="noreferrer" />} nativeButton={false}>
              <HugeiconsIcon icon={LinkSquare01Icon} strokeWidth={2} />
              Open full page
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
