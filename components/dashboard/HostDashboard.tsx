"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar, CreditCard, TrendingUp, Home } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useHostAnalytics } from "@/hooks/useAnalytics"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { TimePeriodFilter } from "./TimePeriodFilter"
import { MetricCard } from "./MetricCard"

export default function HostDashboard() {
  const [timeframe, setTimeframe] = useState("week")
  const { analytics, isLoading } = useHostAnalytics(timeframe)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Host Dashboard</h1>
          <p className="text-muted-foreground">Overview of your properties and bookings</p>
        </div>
        <TimePeriodFilter onPeriodChange={setTimeframe} defaultPeriod={timeframe} />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Properties" value={analytics?.metrics.totalProperties} icon={Building} />
        <MetricCard
          title="Total Bookings"
          value={analytics?.metrics.totalBookings}
          icon={Calendar}
          trend={{
            value: "+8%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard
          title="Period Revenue"
          value={analytics?.metrics.periodRevenue}
          icon={TrendingUp}
          trend={{
            value: "+12%",
            direction: "up",
            label: "vs. last period",
          }}
        />
        <MetricCard title="Total Revenue" value={analytics?.metrics.totalRevenue} icon={CreditCard} />
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
                  color: "hsl(var(--chart-1))",
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
                  <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Properties</CardTitle>
            <CardDescription>Your best performing properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analytics?.topProperties.map((property, index) => (
                <div key={property.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={property.image || "/placeholder.svg?height=36&width=36"} alt={property.title} />
                    <AvatarFallback>
                      <Home className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{property.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {property.bookingCount} {property.bookingCount === 1 ? "booking" : "bookings"}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">{property.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Bookings that require your attention</CardDescription>
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
              {analytics?.upcomingBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={booking.guestImage || "/placeholder.svg?height=32&width=32"}
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
                    <Badge variant="default">{booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}</Badge>
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

