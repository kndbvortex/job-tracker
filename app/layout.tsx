import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/components/locale-provider"
import { ServiceWorkerRegister } from "@/components/service-worker-register"
import { getLocale } from "@/lib/i18n/locale"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "A case file for your job search: track applications from saved to offer.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Job Tracker",
  },
}

export const viewport: Viewport = {
  themeColor: "#1B1B18",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
        <ThemeProvider>
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
