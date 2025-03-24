import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface ReservationDetailsProps {
  booking: any
}

export function ReservationDetails({ booking }: ReservationDetailsProps) {
  // Format totalAmount safely, ensuring it's handled as a number
  const formatCurrency = (amount: any) => {
    // Handle different formats that might come from the server
    const numAmount =
      typeof amount === "number"
        ? amount
        : typeof amount === "string"
          ? Number.parseFloat(amount)
          : typeof amount?.toString === "function"
            ? Number.parseFloat(amount.toString())
            : 0

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: booking.currency || "USD",
    }).format(numAmount)
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="text-center mb-4">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          INQUIRY SENT
        </span>
      </div>

      {booking.property && (
        <div className="mb-6">
          <div className="relative h-40 w-full mb-2 rounded-lg overflow-hidden">
            <Image
              src={booking.property.images?.[0] || "/placeholder.svg?height=300&width=400"}
              alt={booking.property.title || "Property"}
              fill
              className="object-cover"
            />
          </div>

          <h3 className="font-medium mb-1 text-sm">{booking.property.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {booking.property.address?.city}, {booking.property.address?.country}
          </p>

          <div className="flex items-center text-sm mb-1 bg-muted/50 p-3 rounded-lg">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <div className="text-xs">Check-in: {format(new Date(booking.checkInDate), "MMM d, yyyy")}</div>
              <div className="text-xs">Check-out: {format(new Date(booking.checkOutDate), "MMM d, yyyy")}</div>
            </div>
          </div>

          <div className="text-sm mb-2 bg-muted/50 p-3 rounded-lg">
            <div className="flex justify-between py-1">
              <span>Total:</span>
              <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

        
          <Link href={`/dashboard/bookings`}>
          <Button className="w-full">Request to Book</Button>
        </Link>
        </div>
      )}

      <div className="border-t pt-2">
        <h4 className="font-medium mb-2">About this listing</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Most hosts respond within 24 hours. If this listing is your top choice, enter your payment information to
          officially request a reservation.
        </p>

        <Link href={`/booking/${booking.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              View Reservation
            </Button>
          </Link>
      </div>
    </div>
  )
}

