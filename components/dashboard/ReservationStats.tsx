import { CalendarClock, Home, TrendingUp, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getReservationStats, getTodayActivity } from "@/actions/reservations"
import TodayActivity from "./TodayActivity"
import ReservationChart from "./ReservationChart"


export default async function ReservationStats() {
  const stats = await getReservationStats()
  const todayActivity = await getTodayActivity()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">For the current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reservations</CardTitle>
            <CalendarClock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingReservations}</div>
            <p className="text-xs text-muted-foreground">Confirmed future bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todayCheckIns} in / {stats.todayCheckOuts} out
            </div>
            <p className="text-xs text-muted-foreground">Check-ins and check-outs today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Home className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">Booking requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reservation Trends</CardTitle>
            <CardDescription>Booking activity over the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationChart data={stats.chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>Check-ins and check-outs for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="checkins">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="checkins">Check-ins ({todayActivity.checkIns.length})</TabsTrigger>
                <TabsTrigger value="checkouts">Check-outs ({todayActivity.checkOuts.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="checkins" className="mt-4">
                <TodayActivity bookings={todayActivity.checkIns} type="check-in" />
              </TabsContent>
              <TabsContent value="checkouts" className="mt-4">
                <TodayActivity bookings={todayActivity.checkOuts} type="check-out" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

