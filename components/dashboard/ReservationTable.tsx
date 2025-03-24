"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { format } from "date-fns"
import { BookingStatus } from "@prisma/client"
import { CalendarDays, Check, Clock, Eye, Filter, Home, User, X } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { updateBookingStatus } from "@/actions/reservations"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useReservations } from "@/hooks/useReservations"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import ReservationDetails from "./ReservationDetails"
import { DateRangePicker } from "../ui/date-range-picker"
import type { DateRange as DateRangeType } from "react-day-picker" 

interface ReservationTableProps {
  status: BookingStatus
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined; 
}
  
export default function ReservationTable({ status }: ReservationTableProps) {
  const { reservations, isLoading, error, refetch } = useReservations(status)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"CONFIRM" | "DECLINE" | null>(null)
  const [dateRange, setDateRange] = useState<DateRangeType>({ from: undefined, to: undefined })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const selectedBooking = selectedBookingId ? reservations.find((booking) => booking.id === selectedBookingId) : null

  const handleStatusUpdate = async () => {
    if (!selectedBookingId || !actionType) return

    setIsUpdating(true)

    try {
      const newStatus = actionType === "CONFIRM" ? BookingStatus.CONFIRMED : BookingStatus.DECLINED
      await updateBookingStatus(selectedBookingId, newStatus)
      refetch()
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to update booking status:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const openConfirmDialog = (bookingId: string, action: "CONFIRM" | "DECLINE") => {
    setSelectedBookingId(bookingId)
    setActionType(action)
    setDialogOpen(true)
  }

  const openDetailsView = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setDetailsOpen(true)
  }

  // Update the onDateChange handler to correctly handle DateRange type
  const handleDateChange = (range: DateRangeType | undefined) => {
    setDateRange(range || { from: undefined, to: undefined })
  }

  const filteredReservations = reservations.filter((booking) => {
    if (!dateRange.from) return true

    const checkInDate = new Date(booking.checkInDate)

    if (dateRange.to) {
      return checkInDate >= dateRange.from && checkInDate <= dateRange.to
    }

    return checkInDate.toDateString() === dateRange.from.toDateString()
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>Loading reservation data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <p>There was an error loading your reservation data. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ReservationDetailsView = () => (
    <>
      {isDesktop ? (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reservation Details</DialogTitle>
              <DialogDescription>Complete information about this reservation</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              {selectedBooking && <ReservationDetails booking={selectedBooking} />}
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              {status === BookingStatus.PENDING && (
                <>
                  <Button variant="default" onClick={() => openConfirmDialog(selectedBookingId!, "CONFIRM")}>
                    Confirm
                  </Button>
                  <Button variant="destructive" onClick={() => openConfirmDialog(selectedBookingId!, "DECLINE")}>
                    Decline
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Reservation Details</DrawerTitle>
              <DrawerDescription>Complete information about this reservation</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="p-4 max-h-[60vh]">
              {selectedBooking && <ReservationDetails booking={selectedBooking} />}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
              {status === BookingStatus.PENDING && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="default"
                    onClick={() => openConfirmDialog(selectedBookingId!, "CONFIRM")}
                    className="flex-1"
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openConfirmDialog(selectedBookingId!, "DECLINE")}
                    className="flex-1"
                  >
                    Decline
                  </Button>
                </div>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )

  if (reservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Reservations</CardTitle>
          <CardDescription>
            {status === BookingStatus.PENDING
              ? "You don't have any pending booking requests at the moment."
              : `You don't have any ${status.toLowerCase()} reservations.`}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{status} Reservations</CardTitle>
            <CardDescription>
              {status === BookingStatus.PENDING
                ? "Review and respond to booking requests"
                : `Manage your ${status.toLowerCase()} reservations`}
            </CardDescription>
          </div>
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Reservations</DialogTitle>
                <DialogDescription>Select a date range to filter reservations</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDateRange({ from: undefined, to: undefined })
                  }}
                >
                  Reset
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>Apply Filter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {dateRange.from && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Filtered by date:</span>
              <Badge variant="secondary" className="mr-2">
                {format(dateRange.from, "MMM d, yyyy")}
                {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filter</span>
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reservations found for the selected date range
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.guest.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.property.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {format(new Date(booking.checkInDate), "MMM d, yyyy")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            to {format(new Date(booking.checkOutDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: booking.currency,
                      }).format(Number(booking.totalAmount))}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => openDetailsView(booking.id)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>

                        {status === BookingStatus.PENDING && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openConfirmDialog(booking.id, "CONFIRM")}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openConfirmDialog(booking.id, "DECLINE")}
                            >
                              <X className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Decline</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "CONFIRM" ? "Confirm Reservation" : "Decline Reservation"}</DialogTitle>
            <DialogDescription>
              {actionType === "CONFIRM"
                ? "Are you sure you want to confirm this reservation? The guest will be notified."
                : "Are you sure you want to decline this reservation? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              variant={actionType === "CONFIRM" ? "default" : "destructive"}
            >
              {isUpdating ? "Processing..." : actionType === "CONFIRM" ? "Confirm" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedBookingId && <ReservationDetailsView />}
    </>
  )
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const statusConfig = {
    PENDING: { label: "Pending", variant: "outline", icon: Clock },
    CONFIRMED: { label: "Confirmed", variant: "default", icon: Check },
    CANCELLED: { label: "Cancelled", variant: "destructive", icon: X },
    COMPLETED: { label: "Completed", variant: "secondary", icon: Check },
    DECLINED: { label: "Declined", variant: "destructive", icon: X },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant as any} className="flex items-center gap-1">
      <config.icon className="h-3 w-3" />
      <span>{config.label}</span>
    </Badge>
  )
}