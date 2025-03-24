import { format } from "date-fns"
import type { BookingStatus } from "@prisma/client"
import { CalendarClock, CalendarDays, CreditCard, Home, Mail, MapPin, MessageSquare, Phone, Users } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export default function ReservationDetails({ booking }: { booking: any }) {
  // Calculate number of nights
  const checkInDate = new Date(booking.checkInDate)
  const checkOutDate = new Date(booking.checkOutDate)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: booking.currency,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Check-in</div>
              <div>{format(checkInDate, "EEE, MMM d, yyyy")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Check-out</div>
              <div>{format(checkOutDate, "EEE, MMM d, yyyy")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Duration</div>
              <div>
                {nights} {nights === 1 ? "night" : "nights"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Guests</div>
              <div>
                {booking.adults} {booking.adults === 1 ? "adult" : "adults"}
                {booking.children > 0 && `, ${booking.children} ${booking.children === 1 ? "child" : "children"}`}
                {booking.infants > 0 && `, ${booking.infants} ${booking.infants === 1 ? "infant" : "infants"}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Guest Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Guest Information</h3>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={booking.guest.image || ""} alt={booking.guest.name} />
            <AvatarFallback>{booking.guest.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{booking.guest.name}</div>
            <div className="text-sm text-muted-foreground">{booking.guest.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Email</div>
              <div>{booking.guest.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <div className="font-medium">Phone</div>
              <div>{booking.guest.phone || "Not provided"}</div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Property Information */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Property Information</h3>
        <div className="flex items-start gap-4 mb-4">
          <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
            {booking.property.images && booking.property.images.length > 0 ? (
              <img
                src={booking.property.images[0] || "/placeholder.svg"}
                alt={booking.property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{booking.property.title}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {booking.property.address ? (
                <span>
                  {booking.property.address.city}, {booking.property.address.country}
                </span>
              ) : (
                <span>Location not available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Details */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">
                  {formatCurrency(Number(booking.basePrice))} × {nights} nights
                </span>
                <span className="text-sm">{formatCurrency(Number(booking.basePrice) * nights)}</span>
              </div>

              {booking.cleaningFee && Number(booking.cleaningFee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Cleaning fee</span>
                  <span className="text-sm">{formatCurrency(Number(booking.cleaningFee))}</span>
                </div>
              )}

              {booking.serviceFee && Number(booking.serviceFee) > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Service fee</span>
                  <span className="text-sm">{formatCurrency(Number(booking.serviceFee))}</span>
                </div>
              )}

              {booking.taxAmount && Number(booking.taxAmount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Taxes</span>
                  <span className="text-sm">{formatCurrency(Number(booking.taxAmount))}</span>
                </div>
              )}

              <Separator className="my-2" />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(Number(booking.totalAmount))}</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {booking.stripePaymentId ? "Payment processed" : "Payment pending"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Notes */}
      {booking.guestNote && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Guest Message</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                  <div className="text-sm">{booking.guestNote}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Host Notes */}
      {booking.hostNote && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Private Notes</h3>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm">{booking.hostNote}</div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Booking Status */}
      <Separator />
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Status</h3>
          <div className="mt-1">
            <StatusBadge status={booking.status} />
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Booking #{booking.bookingNumber}</div>
          <div className="text-xs text-muted-foreground">
            Created on {format(new Date(booking.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const statusConfig = {
    PENDING: { label: "Pending", variant: "outline" },
    CONFIRMED: { label: "Confirmed", variant: "default" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    COMPLETED: { label: "Completed", variant: "secondary" },
    DECLINED: { label: "Declined", variant: "destructive" },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant as any}>{config.label}</Badge>
}

