import { format } from "date-fns"
import { CalendarClock, Home } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TodayActivityProps {
  bookings: any[]
  type: "check-in" | "check-out"
}

export default function TodayActivity({ bookings, type }: TodayActivityProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CalendarClock className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No {type}s today</h3>
        <p className="text-sm text-muted-foreground">
          {type === "check-in"
            ? "You don't have any guests checking in today."
            : "You don't have any guests checking out today."}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-start gap-4 p-3 rounded-lg border">
            <Avatar className="h-10 w-10">
              <AvatarImage src={booking.guest.image || ""} alt={booking.guest.name} />
              <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">{booking.guest.name}</div>
                <Badge variant={type === "check-in" ? "default" : "secondary"}>
                  {type === "check-in" ? "Check-in" : "Check-out"}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Home className="h-3 w-3" />
                <span className="truncate">{booking.property.title}</span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {type === "check-in"
                    ? `Staying until ${format(new Date(booking.checkOutDate), "MMM d")}`
                    : `Stayed since ${format(new Date(booking.checkInDate), "MMM d")}`}
                </div>

                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

