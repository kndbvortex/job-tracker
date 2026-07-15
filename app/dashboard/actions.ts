"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { applicationStageEnum, applications } from "@/lib/db/schema"
import { captureJobSnapshot } from "@/lib/job-snapshot"
import { removeFromBucket, uploadToBucket } from "@/lib/storage"
import { createClient } from "@/lib/supabase/server"

type Stage = (typeof applicationStageEnum.enumValues)[number]

async function requireUserId() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (!userId) {
    redirect("/auth/login")
  }

  return userId
}

function fieldsFromFormData(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim()
  const role = String(formData.get("role") ?? "").trim()
  const jobUrl = String(formData.get("jobUrl") ?? "").trim()
  const notes = String(formData.get("notes") ?? "").trim()
  const resume = formData.get("resume")
  const resumeFile = resume instanceof File && resume.size > 0 ? resume : null
  const appliedAtRaw = String(formData.get("appliedAt") ?? "")
  const parsedAppliedAt = appliedAtRaw ? new Date(appliedAtRaw) : new Date()
  const appliedAt = Number.isNaN(parsedAppliedAt.getTime()) ? new Date() : parsedAppliedAt

  return { company, role, jobUrl, notes, resumeFile, appliedAt }
}

async function attachResume(userId: string, applicationId: string, resumeFile: File) {
  const supabase = await createClient()
  const ext = resumeFile.name.split(".").pop() || "pdf"
  const path = `${userId}/${applicationId}/resume.${ext}`
  await uploadToBucket(supabase, "resumes", path, resumeFile, resumeFile.type)
  await db.update(applications).set({ resumePath: path }).where(eq(applications.id, applicationId))
}

async function attachJobSnapshot(userId: string, applicationId: string, jobUrl: string) {
  const snapshot = await captureJobSnapshot(jobUrl)
  if (!snapshot) return

  const supabase = await createClient()
  const imagePath = `${userId}/${applicationId}/snapshot.png`
  const pagePath = `${userId}/${applicationId}/snapshot.mhtml`
  await uploadToBucket(supabase, "job-snapshots", imagePath, snapshot.screenshot, "image/png")
  await uploadToBucket(supabase, "job-snapshots", pagePath, Buffer.from(snapshot.mhtml), "multipart/related")
  await db
    .update(applications)
    .set({ jobSnapshotPath: imagePath, jobSnapshotPagePath: pagePath })
    .where(eq(applications.id, applicationId))
}

export async function createApplication(_prevState: unknown, formData: FormData) {
  const userId = await requireUserId()
  const { company, role, jobUrl, notes, resumeFile, appliedAt } = fieldsFromFormData(formData)

  if (!company || !role) {
    return { error: "Company and role are required." }
  }

  const [created] = await db
    .insert(applications)
    .values({
      userId,
      company,
      role,
      jobUrl: jobUrl || null,
      notes: notes || null,
      appliedAt,
      stage: "applied",
    })
    .returning({ id: applications.id })

  if (!created) {
    return { error: "Failed to create application." }
  }

  if (resumeFile) {
    await attachResume(userId, created.id, resumeFile)
  }
  if (jobUrl) {
    await attachJobSnapshot(userId, created.id, jobUrl)
  }

  revalidatePath("/dashboard")
  return { error: null }
}

export async function updateApplication(id: string, _prevState: unknown, formData: FormData) {
  const userId = await requireUserId()
  const { company, role, jobUrl, notes, resumeFile, appliedAt } = fieldsFromFormData(formData)

  if (!company || !role) {
    return { error: "Company and role are required." }
  }

  const [existing] = await db
    .select({ jobUrl: applications.jobUrl })
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  await db
    .update(applications)
    .set({
      company,
      role,
      jobUrl: jobUrl || null,
      notes: notes || null,
      appliedAt,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  if (resumeFile) {
    await attachResume(userId, id, resumeFile)
  }
  if (jobUrl && jobUrl !== existing?.jobUrl) {
    await attachJobSnapshot(userId, id, jobUrl)
  }

  revalidatePath("/dashboard")
  return { error: null }
}

export async function updateApplicationStage(id: string, stage: Stage) {
  const userId = await requireUserId()

  await db
    .update(applications)
    .set({ stage, updatedAt: new Date() })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  revalidatePath("/dashboard")
}

export async function deleteApplication(id: string) {
  const userId = await requireUserId()

  const [existing] = await db
    .select({
      resumePath: applications.resumePath,
      jobSnapshotPath: applications.jobSnapshotPath,
      jobSnapshotPagePath: applications.jobSnapshotPagePath,
    })
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))

  if (existing?.resumePath || existing?.jobSnapshotPath || existing?.jobSnapshotPagePath) {
    const supabase = await createClient()
    if (existing.resumePath) await removeFromBucket(supabase, "resumes", existing.resumePath)
    if (existing.jobSnapshotPath) {
      await removeFromBucket(supabase, "job-snapshots", existing.jobSnapshotPath)
    }
    if (existing.jobSnapshotPagePath) {
      await removeFromBucket(supabase, "job-snapshots", existing.jobSnapshotPagePath)
    }
  }

  revalidatePath("/dashboard")
}
