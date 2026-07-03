"use client"

import Link from "next/link"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { signup } from "@/app/auth/actions"
import { AuthSplitLayout } from "@/components/auth-split-layout"
import { GoogleAuthButton } from "@/components/google-auth-button"
import { useLocale } from "@/components/locale-provider"

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signup, undefined)
  const { dictionary } = useLocale()
  const t = dictionary.auth

  return (
    <AuthSplitLayout>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium">{t.signupTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.signupSubtitle}</p>
      </div>

      <div className="mt-6">
        <GoogleAuthButton />
      </div>

      <div className="my-6 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        {t.orSignUpWith}
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t.email}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t.password}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

        <Button type="submit" disabled={pending} size="lg" className="w-full">
          {pending ? t.creatingAccount : t.signUp}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.alreadyHaveAccount}{" "}
        <Link href="/auth/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          {t.logIn}
        </Link>
      </p>
    </AuthSplitLayout>
  )
}
