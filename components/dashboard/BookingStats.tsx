"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBookingStats } from "@/hooks/useBookings"
import { CalendarDays, Clock, CreditCard, Home } from "lucide-react"

interface BookingStatsProps {
  timeframe: string
}

export default function BookingStats({ timeframe }: BookingStatsProps) {
  const { stats, isLoading } = useBookingStats(timeframe)

  if (isLoading) {
    return <BookingStatsLoading />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <CreditCard className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalSpent}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.bookingCount} {stats?.bookingCount === 1 ? "booking" : "bookings"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          <Home className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.activeBookings}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.activeBookings === 0
              ? "No active stays"
              : stats?.activeBookings === 1
                ? "1 active stay"
                : `${stats?.activeBookings} active stays`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Check-in</CardTitle>
          <CalendarDays className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.nextCheckIn.date || "None"}</div>
          {stats?.nextCheckIn.date ? (
            <p className="text-xs text-muted-foreground">{stats?.nextCheckIn.propertyName}</p>
          ) : (
            <p className="text-xs text-muted-foreground">No upcoming check-ins</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Next Check-out</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.nextCheckOut.date || "None"}</div>
          {stats?.nextCheckOut.date && stats?.nextCheckOut.daysLeft !== null ? (
            <p className="text-xs text-muted-foreground">
              {stats?.nextCheckOut.daysLeft === 0
                ? "Today"
                : stats.nextCheckOut.daysLeft === 1
                  ? "Tomorrow"
                  : `${stats.nextCheckOut.daysLeft} days left`}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">No upcoming check-outs</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function BookingStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

