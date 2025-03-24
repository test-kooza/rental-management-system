"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBookings } from "@/hooks/useBookings"
import BookingList, { BookingListLoading } from "./BookingList"

interface BookingTabsProps {
  timeframe: string
  status: string
}

export default function BookingTabs({ timeframe, status }: BookingTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(status)

  const handleTimeframeChange = (value: string) => {
    router.push(`${pathname}?timeframe=${value}&status=${activeTab}`)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`${pathname}?timeframe=${timeframe}&status=${value}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Booking History</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">
                  {timeframe === "today" && "Today"}
                  {timeframe === "week" && "Last Week"}
                  {timeframe === "month" && "Last Month"}
                  {timeframe === "year" && "Last Year"}
                  {timeframe === "all" && "All Time"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by time</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={timeframe} onValueChange={handleTimeframeChange}>
                <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="week">Last Week</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="month">Last Month</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="year">Last Year</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue={status} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="CONFIRMED">
          <BookingTabContent status="CONFIRMED" timeframe={timeframe} />
        </TabsContent>
        <TabsContent value="PENDING">
          <BookingTabContent status="PENDING" timeframe={timeframe} />
        </TabsContent>
        <TabsContent value="COMPLETED">
          <BookingTabContent status="COMPLETED" timeframe={timeframe} />
        </TabsContent>
        <TabsContent value="CANCELLED">
          <BookingTabContent status="CANCELLED" timeframe={timeframe} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingTabContent({ status, timeframe }: { status: string; timeframe: string }) {
  const { bookings, isLoading } = useBookings(status, timeframe)

  if (isLoading) {
    return <BookingListLoading />
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {status === "CONFIRMED" && <Calendar className="h-12 w-12 text-muted-foreground" />}
        {status === "PENDING" && <Clock className="h-12 w-12 text-muted-foreground" />}
        {status === "COMPLETED" && <Calendar className="h-12 w-12 text-muted-foreground" />}
        {status === "CANCELLED" && <Calendar className="h-12 w-12 text-muted-foreground" />}
        <h3 className="mt-4 text-lg font-medium">No {status.toLowerCase()} bookings</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {status === "CONFIRMED" && "You don't have any confirmed bookings for this period."}
          {status === "PENDING" && "You don't have any pending bookings for this period."}
          {status === "COMPLETED" && "You don't have any completed bookings for this period."}
          {status === "CANCELLED" && "You don't have any cancelled bookings for this period."}
        </p>
      </div>
    )
  }

  return <BookingList bookings={bookings} />
}

export function BookingTabsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-7 w-40 animate-pulse rounded bg-muted"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
      </div>
      <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
      <BookingListLoading />
    </div>
  )
}

