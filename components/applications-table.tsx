"use client"

import { useTransition } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Delete02Icon,
  FileAttachmentIcon,
  Image01Icon,
  LinkSquare01Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { deleteApplication, updateApplicationStage } from "@/app/dashboard/actions"
import { ApplicationFormDialog } from "@/components/application-form-dialog"
import { JobSnapshotDialog } from "@/components/job-snapshot-dialog"
import { STAGE_LABELS } from "@/components/stage-badge"
import type { Application } from "@/lib/db/schema"
import { applicationStageEnum } from "@/lib/db/schema"

export type ApplicationRow = Application & {
  resumeUrl: string | null
  snapshotUrl: string | null
  snapshotPageUrl: string | null
}

export function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const [isPending, startTransition] = useTransition()

  if (applications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No applications match this filter yet.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Files</TableHead>
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">{application.company}</TableCell>
            <TableCell>{application.role}</TableCell>
            <TableCell>
              <Select
                value={application.stage}
                disabled={isPending}
                onValueChange={(value) =>
                  startTransition(() => {
                    void updateApplicationStage(
                      application.id,
                      value as Application["stage"]
                    )
                  })
                }
              >
                <SelectTrigger size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {applicationStageEnum.enumValues.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {STAGE_LABELS[stage]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell className="max-w-64 truncate text-muted-foreground">
              {application.notes}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {application.resumeUrl && (
                  <Button variant="ghost" size="icon-sm" render={<a href={application.resumeUrl} target="_blank" rel="noreferrer" />} nativeButton={false}>
                    <HugeiconsIcon icon={FileAttachmentIcon} strokeWidth={2} />
                    <span className="sr-only">Download resume</span>
                  </Button>
                )}
                {application.jobUrl && (
                  <>
                    <Button variant="ghost" size="icon-sm" render={<a href={application.jobUrl} target="_blank" rel="noreferrer" />} nativeButton={false}>
                      <HugeiconsIcon icon={LinkSquare01Icon} strokeWidth={2} />
                      <span className="sr-only">Open original job posting</span>
                    </Button>
                    {application.snapshotUrl ? (
                      <JobSnapshotDialog
                        company={application.company}
                        snapshotUrl={application.snapshotUrl}
                        snapshotPageUrl={application.snapshotPageUrl}
                      />
                    ) : (
                      <HugeiconsIcon icon={Image01Icon} strokeWidth={2} className="size-4 opacity-30" aria-label="No snapshot captured" />
                    )}
                  </>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <ApplicationFormDialog
                  application={application}
                  trigger={
                    <Button variant="ghost" size="icon-sm">
                      <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
                      <span className="sr-only">Edit</span>
                    </Button>
                  }
                />
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button variant="ghost" size="icon-sm" disabled={isPending} />
                    }
                  >
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
                    <span className="sr-only">Delete</span>
                  </DialogTrigger>
                  <DialogContent showCloseButton={false}>
                    <DialogHeader>
                      <DialogTitle>Supprimer cette candidature ?</DialogTitle>
                      <DialogDescription>
                        {application.company} — {application.role}. Cette action est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose render={<Button variant="outline" />}>
                        Annuler
                      </DialogClose>
                      <DialogClose
                        render={
                          <Button
                            variant="destructive"
                            onClick={() => startTransition(() => void deleteApplication(application.id))}
                          />
                        }
                      >
                        Supprimer
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
