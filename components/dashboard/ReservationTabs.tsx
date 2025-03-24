"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BookingStatus } from "@prisma/client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReservationTable from "./ReservationTable"

interface ReservationTabsProps {
  initialStatus: string
}

export default function ReservationTabs({ initialStatus }: ReservationTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams],
  )

  const handleTabChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("status", value)}`)
  }

  return (
    <Tabs defaultValue={initialStatus} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
        <TabsTrigger value="PENDING">Pending</TabsTrigger>
        <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        <TabsTrigger value="DECLINED">Declined</TabsTrigger>
      </TabsList>

      <TabsContent value="CONFIRMED">
        <ReservationTable status={BookingStatus.CONFIRMED} />
      </TabsContent>

      <TabsContent value="PENDING">
        <ReservationTable status={BookingStatus.PENDING} />
      </TabsContent>

      <TabsContent value="COMPLETED">
        <ReservationTable status={BookingStatus.COMPLETED} />
      </TabsContent>

      <TabsContent value="CANCELLED">
        <ReservationTable status={BookingStatus.CANCELLED} />
      </TabsContent>

      <TabsContent value="DECLINED">
        <ReservationTable status={BookingStatus.DECLINED} />
      </TabsContent>
    </Tabs>
  )
}

