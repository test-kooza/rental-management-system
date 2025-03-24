import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/DashboardShell"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import FinancialStatsLoading from "@/components/dashboard/FinancialStatsLoading"
import FinancialStats from "@/components/dashboard/FinancialStats"
import FinancialChartsLoading from "@/components/dashboard/FinancialChartsLoading"
import FinancialCharts from "@/components/dashboard/FinancialCharts"
import PropertyRevenueTable from "@/components/dashboard/PropertyRevenueTable"
import UpcomingPayouts from "@/components/dashboard/UpcomingPayouts"



export const metadata: Metadata = {
  title: "Financials | Host Dashboard",
  description: "Track your earnings, payouts, and financial performance metrics",
}

export default async function FinancialsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Financial Overview"
        description="Track your earnings, payouts, and financial performance metrics"
      />

      <Suspense fallback={<FinancialStatsLoading />}>
        <FinancialStats />
      </Suspense>

      <Suspense fallback={<FinancialChartsLoading />}>
        <FinancialCharts />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div className="h-[400px] rounded-lg border bg-card animate-pulse" />}>
          <PropertyRevenueTable />
        </Suspense>

        <Suspense fallback={<div className="h-[400px] rounded-lg border bg-card animate-pulse" />}>
          <UpcomingPayouts />
        </Suspense>
      </div>
    </DashboardShell>
  )
}

