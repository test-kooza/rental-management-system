import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import BookingStats, { BookingStatsLoading } from "@/components/dashboard/BookingStats"
import BookingTabs, { BookingTabsLoading } from "@/components/dashboard/BookingTabs"


export const metadata: Metadata = {
  title: "My Bookings | Dashboard",
  description: "View and manage your property bookings and reservation history",
}

export default async function BookingsPage({
    searchParams,
  }: {
    searchParams: Promise<{ timeframe?: string; status?: string }>
  }) {
    const params = await searchParams;
    const timeframe = params.timeframe || "all";  
    const status = params.status || "CONFIRMED"; 

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Bookings"
        description="View and manage all your property bookings and reservation history"
      />

      <Suspense fallback={<BookingStatsLoading />}>
        <BookingStats timeframe={timeframe} />
      </Suspense>

      <Suspense fallback={<BookingTabsLoading />}>
        <BookingTabs timeframe={timeframe} status={status} />
      </Suspense>
    </DashboardShell>
  )
}

