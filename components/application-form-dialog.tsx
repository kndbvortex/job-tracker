"use client"

import { useState, useTransition, type ReactNode } from "react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { createApplication, updateApplication } from "@/app/dashboard/actions"
import { ApplicationDateField } from "@/components/application-date-field"
import type { Application } from "@/lib/db/schema"

export function ApplicationFormDialog({
  application,
  trigger,
}: {
  application?: Application
  trigger: ReactNode
}) {
  const isEdit = Boolean(application)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function handleAction(formData: FormData) {
    startTransition(async () => {
      const result = isEdit
        ? await updateApplication(application!.id, undefined, formData)
        : await createApplication(undefined, formData)

      if (result.error) {
        setError(result.error)
      } else {
        setError(null)
        setOpen(false)
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setError(null)
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit application" : "Add application"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details for this application."
              : "Track a new job you've applied to or are considering."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required defaultValue={application?.company} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required defaultValue={application?.role} />
          </div>
          <ApplicationDateField
            defaultValue={application?.appliedAt ? new Date(application.appliedAt) : undefined}
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              type="url"
              placeholder="https://..."
              defaultValue={application?.jobUrl ?? undefined}
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll capture a screenshot of the posting automatically, in case it gets taken
              down later.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume">CV / Resume</Label>
            <Input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" />
            {application?.resumePath && (
              <p className="text-xs text-muted-foreground">
                A resume is already attached. Choosing a new file replaces it.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" rows={3} defaultValue={application?.notes ?? undefined} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save changes" : "Add application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
