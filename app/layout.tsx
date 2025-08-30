import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Scripts } from "./scripts"
import { InMemoryStorageProvider } from "@/hooks/useInMemoryStorage"
import { MetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Confidential Salary System",
  description: "FHE-powered confidential salary payments on Sepolia",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} bg-background text-foreground antialiased font-sans`}>
        <Scripts />
        <InMemoryStorageProvider>
          <MetaMaskProvider>
            <Providers>
              {children}
            </Providers>
          </MetaMaskProvider>
        </InMemoryStorageProvider>
      </body>
    </html>
  )
}
