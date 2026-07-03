import type { ReactNode } from "react"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { RememberAccountEmail } from "@/components/remember-account-email"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <RememberAccountEmail />
      <DashboardSidebar />
      <div className="flex-1 overflow-x-auto">{children}</div>
    </div>
  )
}
