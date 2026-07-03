"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n/dictionaries"

const LocaleContext = createContext<{
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
} | null>(null)

export function LocaleProvider({
  locale: initialLocale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  return (
    <LocaleContext.Provider value={{ locale, dictionary: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
