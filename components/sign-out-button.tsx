"use client"

import { Button } from "@/components/ui/button"

import { signOut } from "@/app/auth/actions"
import { useLocale } from "@/components/locale-provider"

export function SignOutButton() {
  const { dictionary } = useLocale()

  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" size="sm">
        {dictionary.nav.signOut}
      </Button>
    </form>
  )
}
