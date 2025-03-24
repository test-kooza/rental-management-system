import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getMonthlyRevenueData, getMetricsComparisonData } from "@/actions/financials"
import MonthlyRevenueChart from "./MonthlyRevenueChart"
import MetricsComparisonChart from "./MetricsComparisonChart"

export default async function FinancialCharts() {
  const revenueData = await getMonthlyRevenueData()
  const metricsData = await getMetricsComparisonData()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue for the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyRevenueChart data={revenueData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>ADR and RevPAR comparison over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly" className="pt-4">
              <MetricsComparisonChart data={metricsData.monthly} />
            </TabsContent>
            <TabsContent value="quarterly" className="pt-4">
              <MetricsComparisonChart data={metricsData.quarterly} />
            </TabsContent>
            <TabsContent value="yearly" className="pt-4">
              <MetricsComparisonChart data={metricsData.yearly} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

