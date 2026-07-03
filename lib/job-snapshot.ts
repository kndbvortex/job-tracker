import { chromium, type Locator, type Page } from "playwright"

const CONSENT_BUTTON_PATTERNS = [
  /tout accepter/i,
  /accepter tout/i,
  /^accepter$/i,
  /j'accepte/i,
  /continuer sans accepter/i,
  /accept all/i,
  /^accept$/i,
  /i agree/i,
  /^agree$/i,
  /allow all/i,
  /got it/i,
]

// Fallback dismissal for non-cookie popups: newsletter modals, app-install nags,
// one-tap sign-in prompts, etc. Tried only if no consent button ever appears.
const GENERIC_DISMISS_PATTERNS = [
  /no thanks/i,
  /not now/i,
  /maybe later/i,
  /^skip$/i,
  /^close$/i,
  /^dismiss$/i,
  /continuer sans/i,
  /non merci/i,
  /plus tard/i,
]

function locatorForPatterns(page: Page, patterns: RegExp[]): Locator {
  return patterns.reduce<Locator | null>((combined, pattern) => {
    const candidate = page
      .getByRole("button", { name: pattern })
      .or(page.getByRole("link", { name: pattern }))
    return combined ? combined.or(candidate) : candidate
  }, null) as Locator
}

async function tryDismiss(button: Locator, page: Page, appearTimeout: number) {
  const appeared = await button
    .waitFor({ state: "visible", timeout: appearTimeout })
    .then(() => true)
    .catch(() => false)

  if (!appeared) return false

  await button.click({ timeout: 1500 }).catch(() => {})
  await page.waitForTimeout(500)

  const stillThere = await button.isVisible().catch(() => false)
  if (stillThere) {
    await button.click({ timeout: 1000 }).catch(() => {})
    await page.waitForTimeout(400)
  }

  return true
}

async function dismissOverlays(page: Page) {
  const dismissedCookieBanner = await tryDismiss(
    locatorForPatterns(page, CONSENT_BUTTON_PATTERNS).first(),
    page,
    7000
  )

  // Only look for a generic popup (newsletter/app nag/etc.) if there was no cookie
  // banner — avoids accidentally closing a second, unrelated overlay too eagerly.
  if (!dismissedCookieBanner) {
    await tryDismiss(locatorForPatterns(page, GENERIC_DISMISS_PATTERNS).first(), page, 2500)
  } else {
    await tryDismiss(locatorForPatterns(page, GENERIC_DISMISS_PATTERNS).first(), page, 1500)
  }

  // A close ("X") icon button with no visible text, common for app-install/one-tap nags.
  const closeIconButton = page
    .locator('button[aria-label*="close" i], button[aria-label*="dismiss" i]')
    .first()
  await tryDismiss(closeIconButton, page, 1000)
}

export type JobSnapshot = {
  screenshot: Buffer
  mhtml: string
}

export async function captureJobSnapshot(url: string): Promise<JobSnapshot | null> {
  let browser
  try {
    browser = await chromium.launch({ args: ["--no-sandbox"] })
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      locale: "fr-FR",
    })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 })

    await dismissOverlays(page)

    const screenshot = await page.screenshot({ type: "png", fullPage: true, timeout: 15000 })

    const cdp = await context.newCDPSession(page)
    const { data } = await cdp.send("Page.captureSnapshot", { format: "mhtml" })

    return { screenshot, mhtml: data }
  } catch {
    return null
  } finally {
    await browser?.close()
  }
}
