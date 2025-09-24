import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import Header from "@/components/Header"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Self-Hosted Organizer",
  description: "Task and routine management app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}
