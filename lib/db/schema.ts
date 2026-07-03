import { sql } from "drizzle-orm"
import { pgEnum, pgPolicy, pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { authUid } from "drizzle-orm/supabase"
import { authenticatedRole } from "drizzle-orm/supabase/rls"

// Supabase manages this table; we only reference it, never create/alter it.
const authSchema = pgSchema("auth")
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
})

export const applicationStageEnum = pgEnum("application_stage", [
  "saved",
  "applied",
  "interviewing",
  "offer",
  "rejected",
])

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    company: text("company").notNull(),
    role: text("role").notNull(),
    jobUrl: text("job_url"),
    stage: applicationStageEnum("stage").notNull().default("saved"),
    notes: text("notes"),
    resumePath: text("resume_path"),
    jobSnapshotPath: text("job_snapshot_path"),
    jobSnapshotPagePath: text("job_snapshot_page_path"),
    appliedAt: timestamp("applied_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().default(sql`now()`),
  },
  (table) => [
    pgPolicy("applications_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
    }),
    pgPolicy("applications_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
    pgPolicy("applications_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
      withCheck: sql`${authUid} = ${table.userId}`,
    }),
    pgPolicy("applications_delete_own", {
      for: "delete",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.userId}`,
    }),
  ]
).enableRLS()

export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
