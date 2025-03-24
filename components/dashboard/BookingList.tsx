"use client"

import { useState } from "react"
import Link from "next/link"
import { format, differenceInDays } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Calendar, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { BookingWithProperty } from "@/types/types"
import { MessageButton } from "../messages/MessageButton"

interface BookingListProps {
  bookings: BookingWithProperty[]
}

export default function BookingList({ bookings }: BookingListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}

function BookingCard({ booking }: { booking: BookingWithProperty }) {
  const [currentImage, setCurrentImage] = useState(0)

  const checkInDate = new Date(booking.checkInDate)
  const checkOutDate = new Date(booking.checkOutDate)
  const today = new Date()

  const isActive = today >= checkInDate && today <= checkOutDate
  const isPast = today > checkOutDate
  const isFuture = today < checkInDate

  const daysUntilCheckIn = isFuture ? differenceInDays(checkInDate, today) : null
  const daysUntilCheckOut = isActive ? differenceInDays(checkOutDate, today) : null
  const stayDuration = differenceInDays(checkOutDate, checkInDate)

  const statusColor = {
    CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    DECLINED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }[booking.status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]">
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {booking.property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[200px] md:h-full">
                      <img
                        src={image || "/placeholder.jpg"}
                        alt={`${booking.property.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <Badge className={cn("absolute left-3 top-3 border-none", statusColor)}>{booking.status}</Badge>
          </div>

          <div className="flex flex-col p-4 md:p-6">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{booking.property.title}</h3>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-3.5 w-3.5" />
                  <span>
                    {booking.property.address?.city}, {booking.property.address?.country}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{booking.totalAmount.toString()}</div>
                <div className="text-sm text-muted-foreground">
                  {stayDuration} {stayDuration === 1 ? "night" : "nights"}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Check-in</div>
                  <div className="text-sm text-muted-foreground">{format(checkInDate, "MMM d, yyyy")}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-medium">Check-out</div>
                  <div className="text-sm text-muted-foreground">{format(checkOutDate, "MMM d, yyyy")}</div>
                </div>
              </div>
            </div>

            {isActive && (
              <div className="mt-4 rounded-md bg-primary/10 p-2 text-sm">
                <span className="font-medium text-primary">Currently staying • </span>
                {daysUntilCheckOut === 0
                  ? "Check-out is today"
                  : `${daysUntilCheckOut} ${daysUntilCheckOut === 1 ? "day" : "days"} until check-out`}
              </div>
            )}

            {isFuture && (
              <div className="mt-4 rounded-md bg-blue-50 p-2 text-sm dark:bg-blue-900/20">
                <span className="font-medium text-blue-700 dark:text-blue-400">Upcoming • </span>
                {daysUntilCheckIn === 0
                  ? "Check-in is today"
                  : `${daysUntilCheckIn} ${daysUntilCheckIn === 1 ? "day" : "days"} until check-in`}
              </div>
            )}

            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-medium">Booking #:</span> {booking.bookingNumber}
              </div>
              <Link href={`/properties/${booking.property.slug}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <span>View Property</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
             <div className="mt-4">
                        <MessageButton
                          propertyId={booking.property.id}
                          hostId={booking.property.hostId}
                          />
           </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BookingListLoading() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]">
                <div className="h-[200px] animate-pulse bg-muted md:h-full"></div>
                <div className="flex flex-col p-4 md:p-6">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-6 w-48 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 w-20 animate-pulse rounded bg-muted"></div>
                      <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="h-12 animate-pulse rounded bg-muted"></div>
                    <div className="h-12 animate-pulse rounded bg-muted"></div>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                    <div className="h-8 w-28 animate-pulse rounded bg-muted"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

