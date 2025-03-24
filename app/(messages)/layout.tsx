import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import PropertyHeader from "@/components/frontend/property-header"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { redirect } from "next/navigation"
import MobileFooter from "@/components/frontend/mobile-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Property Rental Platform",
  description: "Find and book properties for your next stay",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          redirect("/login?returnUrl=/dashboard");
        }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <PropertyHeader session={session} />
          <Suspense fallback={null}>
            {children}
          </Suspense>
          
      </body>
    </html>
  )
}

