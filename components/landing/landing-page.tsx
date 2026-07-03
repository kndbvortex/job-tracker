"use client"

import Link from "next/link"
import { type Variants, motion } from "motion/react"
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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

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
    <div className="bg-[#FBF9F3] text-[#1B1B18] dark:bg-background dark:text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-[#1B1B18] text-[#FBF9F3] dark:bg-foreground dark:text-background">
            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-4" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-tight">JOB TRACKER</span>
        </motion.div>
        <motion.nav
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ThemeSwitcher />
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button
              className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-foreground dark:text-background dark:hover:bg-foreground/80"
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
                className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-foreground dark:text-background dark:hover:bg-foreground/80"
                render={<Link href="/auth/sign-up" />}
                nativeButton={false}
              >
                {nav.signUp}
              </Button>
            </>
          )}
        </motion.nav>
      </header>

      <section className="mx-auto grid max-w-5xl gap-12 px-6 pt-10 pb-20 md:grid-cols-2 md:items-center md:pt-16">
        <motion.div
          className="flex flex-col gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.p variants={fadeUp} className="font-mono text-xs tracking-[0.2em] text-[#6B6558] dark:text-muted-foreground">
            {t.eyebrow}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-mono text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">
            {t.headlineLine1}
            <br />
            {t.headlineLine2}
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-md text-base text-[#4A463C] dark:text-muted-foreground">
            {t.subhead}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="bg-[#1B1B18] text-[#FBF9F3] hover:bg-[#1B1B18]/80 dark:bg-foreground dark:text-background dark:hover:bg-foreground/80"
              render={<Link href={startHref} />}
              nativeButton={false}
            >
              {t.startCta}
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} className="pt-4">
            <StageRail labels={t.stages} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <CaseFileCard />
        </motion.div>
      </section>

      <section className="border-t border-[#E4E0D3] bg-[#F4F1E8] dark:border-border dark:bg-card">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            {exhibits.map((exhibit, i) => (
              <motion.div
                key={exhibit.tag}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={exhibit.icon} strokeWidth={2} className="size-5 text-[#33415C] dark:text-[#86A6D9]" />
                  <p className="font-mono text-[11px] tracking-[0.2em] text-[#6B6558] dark:text-muted-foreground">
                    {exhibit.tag}
                  </p>
                </div>
                <h3 className="text-lg font-medium">{exhibit.title}</h3>
                <p className="text-sm text-[#4A463C] dark:text-muted-foreground">{exhibit.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1B1B18] text-[#FBF9F3] dark:bg-[#0a0a08]">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-20">
          <motion.h2
            className="font-mono text-3xl font-bold tracking-tight sm:text-4xl"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {t.ctaHeadline}
          </motion.h2>
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

      <footer className="mx-auto max-w-5xl px-6 py-8 text-xs text-[#6B6558] dark:text-muted-foreground">
        {t.footer}
      </footer>
    </div>
  )
}
