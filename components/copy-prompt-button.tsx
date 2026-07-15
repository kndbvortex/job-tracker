"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { CV_RECRUITER_PROMPT } from "@/lib/prompts"

export function CopyPromptButton({
  label,
  copiedLabel,
}: {
  label: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(CV_RECRUITER_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} strokeWidth={2} />
      {copied ? copiedLabel : label}
    </Button>
  )
}
