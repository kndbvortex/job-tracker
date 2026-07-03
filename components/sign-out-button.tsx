"use client"

import { SecondaryGrowButton } from "@/components/ui/grow-button"

import { signOut } from "@/app/auth/actions"
import { useLocale } from "@/components/locale-provider"

export function SignOutButton() {
  const { dictionary } = useLocale()

  return (
    <form action={signOut}>
      <SecondaryGrowButton type="submit" size="sm" className="w-full">
        {dictionary.nav.signOut}
      </SecondaryGrowButton>
    </form>
  )
}
