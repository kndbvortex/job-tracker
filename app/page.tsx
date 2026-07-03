import { LandingPage } from "@/components/landing/landing-page"
import { getDictionary } from "@/lib/i18n/locale"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const { dictionary } = await getDictionary()

  return <LandingPage isAuthenticated={Boolean(data?.claims)} dictionary={dictionary} />
}
