import { cookies } from "next/headers"

import { dictionaries, locales, type Locale } from "@/lib/i18n/dictionaries"

export const LOCALE_COOKIE = "locale"

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return locales.includes(value as Locale) ? (value as Locale) : "en"
}

export async function getDictionary() {
  const locale = await getLocale()
  return { locale, dictionary: dictionaries[locale] }
}
