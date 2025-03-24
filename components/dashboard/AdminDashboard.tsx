"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building, Users, UserCog, CreditCard } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAdminAnalytics } from "@/hooks/useAnalytics"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { TimePeriodFilter } from "./TimePeriodFilter"
import { MetricCard } from "./MetricCard"
import { AnyARecord } from "dns"

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("week")
  const { analytics, isLoading } = useAdminAnalytics(timeframe)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform's performance and metrics</p>
        </div>
        <TimePeriodFilter onPeriodChange={setTimeframe} defaultPeriod={timeframe} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Properties"
          value={analytics?.metrics.totalProperties}
          icon={Building}
          trend={{
            value: "+12%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard
          title="Total Users"
          value={analytics?.metrics.totalUsers}
          icon={Users}
          trend={{
            value: "+8%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard
          title="Total Hosts"
          value={analytics?.metrics.totalHosts}
          icon={UserCog}
          trend={{
            value: "+5%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard
          title="Total Revenue"
          value={analytics?.metrics.totalRevenue}
          icon={CreditCard}
          trend={{
            value: "+15%",
            direction: "up",
            label: "vs. last period",
          }}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Number of bookings over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer
              config={{
                bookings: {
                  label: "Bookings",
                  color: "#ff385c",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.bookingTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis
                    dataKey={timeframe === "year" ? "month" : timeframe === "today" ? "hour" : "day"}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Bar dataKey="bookings" fill="#ff385c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Hosts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Hosts</CardTitle>
            <CardDescription>Hosts with most properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics?.topHosts.map((host:any, index:any) => (
                <div key={host.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={host.image || "/placeholder.jpg"} alt={host.name} />
                    <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{host.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {host.propertyCount} {host.propertyCount === 1 ? "property" : "properties"}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">#{index + 1}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest bookings across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics?.recentBookings.map((booking:any) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={booking.guestImage || "/placeholder.jpg"}
                          alt={booking.guestName}
                        />
                        <AvatarFallback>{booking.guestName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{booking.guestName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.propertyTitle}</TableCell>
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

