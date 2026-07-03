"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Briefcase01Icon, DashboardSquare01Icon, Home01Icon, Menu01Icon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "@/components/locale-provider"
import { SignOutButton } from "@/components/sign-out-button"
import { ThemeSwitcher } from "@/components/theme-switcher"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 px-2 transition-opacity hover:opacity-75">
      <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-5 text-[#4AAFFD]" />
      <span className="text-sm font-semibold tracking-tight">Job Tracker</span>
    </Link>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { dictionary } = useLocale()

  const links = [
    { href: "/", label: dictionary.nav.home, icon: Home01Icon, exact: true },
    { href: "/dashboard", label: dictionary.nav.dashboard, icon: DashboardSquare01Icon, exact: true },
  ]

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={link.icon} strokeWidth={2} className="size-4" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DashboardSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden h-svh w-56 shrink-0 flex-col justify-between border-r border-border p-4 md:flex md:sticky md:top-0">
        <div className="flex flex-col gap-6">
          <Logo />
          <NavLinks />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <SignOutButton />
        </div>
      </aside>

      <header className="flex items-center justify-between border-b border-border p-3 md:hidden">
        <Logo />
        <Sheet open={open} onOpenChange={setOpen}>
          <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
            <span className="sr-only">Open menu</span>
          </Button>
          <SheetContent side="left" className="justify-between p-4">
            <div className="flex flex-col gap-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <Logo />
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <LanguageSwitcher />
              </div>
              <SignOutButton />
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
