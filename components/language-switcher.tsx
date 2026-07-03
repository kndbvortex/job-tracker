"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { setLocale } from "@/lib/i18n/actions"
import type { Locale } from "@/lib/i18n/dictionaries"
import { useLocale } from "@/components/locale-provider"

function FlagUS({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#B22234" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} x="0" y={y} width="20" height="1.08" fill="#FFFFFF" />
      ))}
      <rect width="8" height="7.6" rx="2" fill="#3C3B6E" />
    </svg>
  )
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#ED2939" />
      <rect width="13.3" height="14" fill="#FFFFFF" />
      <rect width="6.7" height="14" fill="#002395" />
    </svg>
  )
}

const FLAG_MAP: Record<Locale, React.ComponentType<{ className?: string }>> = {
  en: FlagUS,
  fr: FlagFR,
}

const LANGUAGES: { value: Locale; fullLabel: string }[] = [
  { value: "en", fullLabel: "English" },
  { value: "fr", fullLabel: "Français" },
]

export function LanguageSwitcher() {
  const { locale, setLocale: setLocaleState } = useLocale()
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleChange(value: string) {
    const next = value as Locale
    setLocaleState(next)
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  const CurrentFlag = FLAG_MAP[locale] ?? FlagUS

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" disabled={pending} />}>
        <CurrentFlag className="size-4 rounded-[2px]" />
        <span className="sr-only">Language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => {
            const Flag = FLAG_MAP[lang.value]
            return (
              <DropdownMenuRadioItem key={lang.value} value={lang.value}>
                <span className="flex items-center gap-2">
                  <Flag className="size-4 rounded-[2px]" />
                  <span>{lang.fullLabel}</span>
                </span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
