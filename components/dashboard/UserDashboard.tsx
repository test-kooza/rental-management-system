"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, TrendingUp, Home } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useUserAnalytics } from "@/hooks/useAnalytics"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { TimePeriodFilter } from "./TimePeriodFilter"
import { MetricCard } from "./MetricCard"

export default function UserDashboard() {
  const [timeframe, setTimeframe] = useState("week")
  const { analytics, isLoading } = useUserAnalytics(timeframe)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground">Overview of your bookings and spending</p>
        </div>
        <TimePeriodFilter onPeriodChange={setTimeframe} defaultPeriod={timeframe} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Bookings" value={analytics?.metrics.totalBookings} icon={Calendar} />
        <MetricCard
          title="Period Bookings"
          value={analytics?.metrics.periodBookings}
          icon={Calendar}
          trend={{
            value: "+5%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard
          title="Period Spending"
          value={analytics?.metrics.periodSpending}
          icon={TrendingUp}
          trend={{
            value: "+8%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard title="Total Spending" value={analytics?.metrics.totalSpending} icon={CreditCard} />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Your spending over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer
              config={{
                spending: {
                  label: "Spending",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.spendingTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey={timeframe === "year" ? "month" : timeframe === "today" ? "hour" : "day"}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="spending" fill="var(--color-spending)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Upcoming Stays */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Stays</CardTitle>
            <CardDescription>Your next adventures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics?.upcomingBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={booking.propertyImage || "/placeholder.svg?height=36&width=36"}
                      alt={booking.propertyTitle}
                    />
                    <AvatarFallback>
                      <Home className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{booking.propertyTitle}</p>
                    <p className="text-sm text-muted-foreground">{booking.checkInDate}</p>
                  </div>
                  <div className="ml-auto font-medium">{booking.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking History */}
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>Your past and upcoming bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.bookingHistory.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={booking.propertyImage || "/placeholder.svg?height=32&width=32"}
                          alt={booking.propertyTitle}
                        />
                        <AvatarFallback>
                          <Home className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{booking.propertyTitle}</span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.checkInDate}</TableCell>
                  <TableCell>{booking.checkOutDate}</TableCell>
                  <TableCell>{booking.amount}</TableCell>
                  <TableCell>
                  <span
  className={
    booking.status === "CONFIRMED"
      ? "bg-gray-200 text-gray-800 px-2 py-1 rounded"
      : booking.status === "COMPLETED"
        ? "bg-green-200 text-green-800 px-2 py-1 rounded"
        : booking.status === "CANCELLED"
          ? "bg-red-200 text-red-800 px-2 py-1 rounded"
          : booking.status === "PENDING"
            ? "border border-gray-400 text-gray-800 px-2 py-1 rounded"
            : "bg-gray-300 text-gray-800 px-2 py-1 rounded"
  }
>
  {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
</span>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

