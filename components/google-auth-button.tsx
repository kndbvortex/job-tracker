"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Google2025Icon } from "@/components/icons/google-2025-icon"

import { useLocale } from "@/components/locale-provider"
import { getRememberedEmail } from "@/lib/remembered-account"
import { createClient } from "@/lib/supabase/client"

export function GoogleAuthButton() {
  const [pending, setPending] = useState(false)
  const { dictionary } = useLocale()

  async function handleClick() {
    setPending(true)
    const supabase = createClient()
    const rememberedEmail = getRememberedEmail()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...(rememberedEmail && { queryParams: { login_hint: rememberedEmail } }),
      },
    })

    if (error) {
      setPending(false)
    }
  }

  return (
    <Button type="button" variant="outline" className="w-full" disabled={pending} onClick={handleClick}>
      <Google2025Icon className="size-4" data-icon="inline-start" />
      {pending ? "..." : dictionary.auth.continueWithGoogle}
    </Button>
  )
}
