const STORAGE_KEY = "job-tracker:last-account-email"

export function getRememberedEmail(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function rememberEmail(email: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, email)
}
