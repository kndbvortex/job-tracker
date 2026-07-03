"use client"

import { useEffect } from "react"

import { rememberEmail } from "@/lib/remembered-account"
import { createClient } from "@/lib/supabase/client"

export function RememberAccountEmail() {
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        rememberEmail(data.user.email)
      }
    })
  }, [])

  return null
}
