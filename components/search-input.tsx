"use client"

import { useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import { useLocale } from "@/components/locale-provider"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dictionary } = useLocale()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      router.push(`/dashboard?${params.toString()}`)
    }, 300)
  }

  return (
    <div className="relative">
      <HugeiconsIcon
        icon={Search01Icon}
        strokeWidth={2}
        className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        placeholder={dictionary.dashboard.searchPlaceholder}
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        className="h-8 w-full pl-8 text-sm"
      />
    </div>
  )
}
