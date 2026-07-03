"use client"

import Image from "next/image"
import Link from "next/link"
import { type Variants, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  Camera01Icon,
  FileAttachmentIcon,
  ChartLineData02Icon,
} from "@hugeicons/core-free-icons"

import { PrimaryGrowButton } from "@/components/ui/grow-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import type { Dictionary } from "@/lib/i18n/dictionaries"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#09090b] dark:text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#09090b]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="size-5 text-[#4AAFFD]" />
            <span className="text-sm font-semibold tracking-tight">Job Tracker</span>
          </div>
          <nav className="flex items-center gap-1.5">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-10 text-center">
        <motion.div
          className="mx-auto max-w-2xl"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
          >
            {t.headlineLine1}
            <br />
            {t.headlineLine2}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-lg text-base text-slate-500 dark:text-slate-400"
          >
            {t.subhead}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <PrimaryGrowButton
              size="lg"
              render={<Link href={startHref} />}
              nativeButton={false}
            >
              {t.startCta}
            </PrimaryGrowButton>
          </motion.div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          className="mx-auto mt-14 max-w-5xl"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        >
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/60 dark:border-white/10 dark:shadow-none">
            <Image
              src="/hero-removebg-preview.png"
              alt="Job Tracker dashboard"
              width={1523}
              height={1032}
              className="w-full"
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <div className="mt-10 border-y border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 px-6 py-8 text-center">
          {[
            { value: t.stat1Value, label: t.stat1Label },
            { value: t.stat2Value, label: t.stat2Label },
            { value: t.stat3Value, label: t.stat3Label },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t.featuresHeadline}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">{t.featuresSubhead}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {exhibits.map((exhibit, i) => (
              <motion.div
                key={exhibit.tag}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/[0.03]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#4AAFFD]/10">
                  <HugeiconsIcon
                    icon={exhibit.icon}
                    strokeWidth={2}
                    className="size-5 text-[#4AAFFD]"
                  />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{exhibit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{exhibit.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA section ── */}
      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-slate-900 p-12 text-center dark:bg-white/5 dark:ring-1 dark:ring-white/10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t.ctaHeadline}
          </h2>
          <p className="mt-3 text-slate-400">
            {isAuthenticated ? t.ctaSubAuthenticated : t.ctaSubAnonymous}
          </p>
          <PrimaryGrowButton
            size="lg"
            className="mt-8"
            render={<Link href={startHref} />}
            nativeButton={false}
          >
            {isAuthenticated ? t.ctaButtonAuthenticated : t.ctaButtonAnonymous}
          </PrimaryGrowButton>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-100 dark:border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-400 dark:text-slate-500">
          {t.footer}
        </div>
      </footer>
    </div>
  )
}
