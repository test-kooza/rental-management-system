import { CreditCard, DollarSign, TrendingUp, BarChart3 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getFinancialStats } from "@/actions/financials"

export default async function FinancialStats() {
  const stats = await getFinancialStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.currentMonthRevenue.formatted}</div>
          <p className="text-xs text-muted-foreground">
            {stats.revenueChange >= 0 ? (
              <span className="text-green-500">+{stats.revenueChange}%</span>
            ) : (
              <span className="text-red-500">{stats.revenueChange}%</span>
            )}{" "}
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Payouts</CardTitle>
          <CreditCard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingPayouts.formatted}</div>
          <p className="text-xs text-muted-foreground">Next payout on {stats.nextPayoutDate}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageDailyRate.formatted}</div>
          <p className="text-xs text-muted-foreground">Across {stats.propertyCount} properties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
          <BarChart3 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.revPAR.formatted}</div>
          <p className="text-xs text-muted-foreground">Revenue per available room</p>
        </CardContent>
      </Card>
    </div>
  )
}

