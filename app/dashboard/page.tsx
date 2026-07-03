import { desc, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { applications } from "@/lib/db/schema"
import { getSignedUrl } from "@/lib/storage"
import { createClient } from "@/lib/supabase/server"
import { ApplicationFormDialog } from "@/components/application-form-dialog"
import { ApplicationsLineChart } from "@/components/applications-line-chart"
import { ApplicationsTable, type ApplicationRow } from "@/components/applications-table"
import { PrimaryGrowButton } from "@/components/ui/grow-button"
import { DashboardDonutChart } from "@/components/dashboard-donut-chart"
import { PeriodFilter } from "@/components/period-filter"
import { SearchInput } from "@/components/search-input"
import { StageFilter } from "@/components/stage-filter"
import { getDictionary } from "@/lib/i18n/locale"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; from?: string; to?: string; search?: string }>
}) {
  const { stage, from, to, search } = await searchParams
  const { dictionary } = await getDictionary()
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data!.claims!.sub as string

  const rows = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt))

  const counts: Record<string, number> = {}
  for (const row of rows) {
    counts[row.stage] = (counts[row.stage] ?? 0) + 1
  }

  const allDates = rows.map((row) => row.appliedAt ?? row.createdAt)
  const now = new Date()
  const earliest = allDates.length
    ? new Date(Math.min(...allDates.map((d) => d.getTime())))
    : new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

  const fromDate = from ? new Date(from) : earliest
  const toDate = to ? new Date(`${to}T23:59:59`) : now

  let filteredRows = stage ? rows.filter((row) => row.stage === stage) : rows
  if (from) {
    filteredRows = filteredRows.filter((row) => (row.appliedAt ?? row.createdAt) >= fromDate)
  }
  if (to) {
    filteredRows = filteredRows.filter((row) => (row.appliedAt ?? row.createdAt) <= toDate)
  }
  if (search) {
    const q = search.toLowerCase()
    filteredRows = filteredRows.filter(
      (row) =>
        row.company.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q) ||
        (row.notes?.toLowerCase().includes(q) ?? false)
    )
  }

  const rowsWithFiles: ApplicationRow[] = await Promise.all(
    filteredRows.map(async (row) => ({
      ...row,
      resumeUrl: row.resumePath ? await getSignedUrl(supabase, "resumes", row.resumePath) : null,
      snapshotUrl: row.jobSnapshotPath
        ? await getSignedUrl(supabase, "job-snapshots", row.jobSnapshotPath)
        : null,
      snapshotPageUrl: row.jobSnapshotPagePath
        ? await getSignedUrl(supabase, "job-snapshots", row.jobSnapshotPagePath)
        : null,
    }))
  )

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold tracking-tight">{dictionary.dashboard.applications}</h1>
        <ApplicationFormDialog trigger={<PrimaryGrowButton>{dictionary.dashboard.addApplication}</PrimaryGrowButton>} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardDonutChart counts={counts} />
        <ApplicationsLineChart dates={allDates} from={fromDate} to={toDate} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StageFilter activeStage={stage} from={from} to={to} search={search} />
          <SearchInput />
        </div>
        <PeriodFilter from={from} to={to} />
      </div>

      <div className="overflow-x-auto">
        <ApplicationsTable applications={rowsWithFiles} />
      </div>
    </div>
  )
}
