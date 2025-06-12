import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { BookmarksProvider } from "@/context/bookmarks-context"
import Header from "@/components/header"
import ApiStatusBanner from "@/components/api-status-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DinBhar | Latest News",
  description: "Stay updated with the latest news from around the world",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <BookmarksProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <ApiStatusBanner />
              <main>{children}</main>
            </div>
          </BookmarksProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
