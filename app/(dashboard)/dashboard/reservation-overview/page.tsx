import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import ReservationStats from "@/components/dashboard/ReservationStats"
import { ReservationStatsLoading } from "@/components/dashboard/ReservationStatsLoading"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ReservationTabsLoading } from "@/components/dashboard/ReservationTabsLoading"
import ReservationTabs from "@/components/dashboard/ReservationTabs"



export const metadata: Metadata = {
  title: "Reservations | Host Dashboard",
  description: "Manage your property reservations and booking requests",
}

export default async function ReservationsPage({
    searchParams,
  }: {
    searchParams: Promise<{ status?: string }>
  }) {
    const params = await searchParams
  const status = params.status || "CONFIRMED"

  return (
    <DashboardShell>
      <DashboardHeader heading="Reservations" description="Manage your property bookings and reservation requests." />

      <Suspense fallback={<ReservationStatsLoading />}>
        <ReservationStats />
      </Suspense>

      <Suspense fallback={<ReservationTabsLoading />}>
        <ReservationTabs initialStatus={status} />
      </Suspense>
    </DashboardShell>
  )
}

