import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  Camera01Icon,
  FileAttachmentIcon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { CaseFileCard } from "@/components/landing/case-file-card"
import { StageRail } from "@/components/landing/stage-rail"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import type { Dictionary } from "@/lib/i18n/dictionaries"

export function LandingPage({
  isAuthenticated,
  dictionary,
}: {
  isAuthenticated: boolean
  dictionary: Dictionary
}) {
  const startHref = isAuthenticated ? "/dashboard" : "/auth/login"
  const t = dictionary.landing
  const nav = dictionary.nav

  const exhibits = [
    { ...t.exhibitA, icon: Camera01Icon },
    { ...t.exhibitB, icon: FileAttachmentIcon },
    { ...t.exhibitC, icon: ChartLineData02Icon },
  ]

  return (
    <div className="bg-[#FBF9F3] text-[#1B1B18] dark:bg-[#1B1B18] dark:text-[#FBF9F3]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#1B1B18] text-[#FBF9F3] dark:bg-[#FBF9F3] dark:text-[#1B1B18]">
            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-4" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">JOB TRACKER</span>
        </div>
        <nav className="flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button
              className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-[#FBF9F3] dark:text-[#1B1B18] dark:hover:bg-[#FBF9F3]/80"
              render={<Link href="/dashboard" />}
              nativeButton={false}
            >
              {nav.goToDashboard}
            </Button>
          ) : (
            <>
              <Button variant="ghost" render={<Link href="/auth/login" />} nativeButton={false}>
                {nav.logIn}
              </Button>
              <Button
                className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-[#FBF9F3] dark:text-[#1B1B18] dark:hover:bg-[#FBF9F3]/80"
                render={<Link href="/auth/sign-up" />}
                nativeButton={false}
              >
                {nav.signUp}
              </Button>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto grid max-w-5xl gap-12 px-6 pt-10 pb-20 md:grid-cols-2 md:items-center md:pt-16">
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-[0.2em] text-[#6B6558]">{t.eyebrow}</p>
          <h1 className="font-mono text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            {t.headlineLine1}
            <br />
            {t.headlineLine2}
          </h1>
          <p className="max-w-md text-base text-[#4A463C] dark:text-[#C9C4B4]">{t.subhead}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-[#FBF9F3] dark:text-[#1B1B18] dark:hover:bg-[#FBF9F3]/80"
              render={<Link href={startHref} />}
              nativeButton={false}
            >
              {t.startCta}
            </Button>
          </div>
          <div className="pt-4">
            <StageRail labels={t.stages} />
          </div>
        </div>

        <CaseFileCard />
      </section>

      <section className="border-t border-[#E4E0D3] bg-[#F4F1E8] dark:border-[#33332E] dark:bg-[#232320]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {exhibits.map((exhibit) => (
              <div key={exhibit.tag} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={exhibit.icon} strokeWidth={2} className="size-5 text-[#33415C] dark:text-[#86A6D9]" />
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#6B6558]">
                    {exhibit.tag}
                  </p>
                </div>
                <h3 className="text-lg font-medium">{exhibit.title}</h3>
                <p className="text-sm text-[#4A463C] dark:text-[#C9C4B4]">{exhibit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1B1B18] text-[#FBF9F3] dark:bg-[#0F0F0D]">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-20">
          <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
            {t.ctaHeadline}
          </h2>
          <p className="max-w-md text-[#FBF9F3]/70">
            {isAuthenticated ? t.ctaSubAuthenticated : t.ctaSubAnonymous}
          </p>
          <Button
            size="lg"
            className="bg-[#FBF9F3] text-[#1B1B18] hover:bg-[#FBF9F3]/80"
            render={<Link href={startHref} />}
            nativeButton={false}
          >
            {isAuthenticated ? t.ctaButtonAuthenticated : t.ctaButtonAnonymous}
          </Button>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-8 text-xs text-[#6B6558]">{t.footer}</footer>
    </div>
  )
}
