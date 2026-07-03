"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { TranslateIcon } from "@hugeicons/core-free-icons"

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

const LANGUAGES: { value: Locale; flag: string; label: string }[] = [
  { value: "en", flag: "🇺🇸", label: "English" },
  { value: "fr", flag: "🇫🇷", label: "Français" },
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon-sm" disabled={pending} />}>
        <HugeiconsIcon icon={TranslateIcon} strokeWidth={2} />
        <span className="sr-only">Language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          <DropdownMenuLabel>Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => (
            <DropdownMenuRadioItem key={lang.value} value={lang.value}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
