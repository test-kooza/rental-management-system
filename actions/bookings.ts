"use server"

import { db } from "@/prisma/db"
import { BookingWithProperty } from "@/types/types"
import { BookingStatus } from "@prisma/client"
import { startOfDay, endOfDay, subWeeks, subMonths, subYears, format, differenceInDays } from "date-fns"
import { getAuthenticatedUser } from "@/config/useAuth"

// Format currency
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get bookings for the current user with filtering
export async function getBookings(status: string, timeframe: string): Promise<BookingWithProperty[]> {
  try {
    const { id:userId } = await getAuthenticatedUser()

    // Calculate date range based on timeframe
    const today = new Date()
    let startDate: Date | undefined

    if (timeframe === "today") {
      startDate = startOfDay(today)
    } else if (timeframe === "week") {
      startDate = subWeeks(today, 1)
    } else if (timeframe === "month") {
      startDate = subMonths(today, 1)
    } else if (timeframe === "year") {
      startDate = subYears(today, 1)
    }

    // Build the query filter
    const dateFilter = startDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endOfDay(today),
          },
        }
      : {}

    // Get bookings with property details
    const bookings = await db.booking.findMany({
      where: {
        guestId: userId,
        status: status as BookingStatus,
        ...dateFilter,
      },
      include: {
        property: {
          include: {
            address: true,
          },
        },
      },
      orderBy: {
        checkInDate: "desc",
      },
    })

    return bookings as BookingWithProperty[]
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}

// Get booking statistics for the current user
export async function getBookingStats(timeframe: string) {
  try {
    const { id:userId } = await getAuthenticatedUser()

    // Calculate date range based on timeframe
    const today = new Date()
    let startDate: Date | undefined

    if (timeframe === "today") {
      startDate = startOfDay(today)
    } else if (timeframe === "week") {
      startDate = subWeeks(today, 1)
    } else if (timeframe === "month") {
      startDate = subMonths(today, 1)
    } else if (timeframe === "year") {
      startDate = subYears(today, 1)
    }

    // Build the query filter for date range
    const dateFilter = startDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endOfDay(today),
          },
        }
      : {}

    // Get all bookings for the user within the timeframe
    const bookings = await db.booking.findMany({
      where: {
        guestId: userId,
        ...dateFilter,
      },
      include: {
        property: true,
      },
      orderBy: {
        checkInDate: "asc",
      },
    })

    // Calculate total spent
    const totalAmount = bookings.reduce((sum, booking) => {
      if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED) {
        return sum + Number(booking.totalAmount)
      }
      return sum
    }, 0)

    // Count active bookings (check-in date <= today <= check-out date)
    const activeBookings = bookings.filter((booking) => {
      const checkInDate = new Date(booking.checkInDate)
      const checkOutDate = new Date(booking.checkOutDate)
      return booking.status === BookingStatus.CONFIRMED && today >= checkInDate && today <= checkOutDate
    }).length

    // Find next check-in
    const upcomingBookings = bookings
      .filter((booking) => {
        const checkInDate = new Date(booking.checkInDate)
        return booking.status === BookingStatus.CONFIRMED && checkInDate > today
      })
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())

    const nextCheckIn =
      upcomingBookings.length > 0
        ? {
            date: format(new Date(upcomingBookings[0].checkInDate), "MMM d, yyyy"),
            propertyName: upcomingBookings[0].property.title,
          }
        : { date: null, propertyName: null }

    // Find next check-out for active bookings
    const activeBookingsData = bookings
      .filter((booking) => {
        const checkInDate = new Date(booking.checkInDate)
        const checkOutDate = new Date(booking.checkOutDate)
        return booking.status === BookingStatus.CONFIRMED && today >= checkInDate && today <= checkOutDate
      })
      .sort((a, b) => new Date(a.checkOutDate).getTime() - new Date(b.checkOutDate).getTime())

    const nextCheckOut =
      activeBookingsData.length > 0
        ? {
            date: format(new Date(activeBookingsData[0].checkOutDate), "MMM d, yyyy"),
            daysLeft: differenceInDays(new Date(activeBookingsData[0].checkOutDate), today),
            propertyName: activeBookingsData[0].property.title,
          }
        : { date: null, daysLeft: null, propertyName: null }

    return {
      totalSpent: formatCurrency(totalAmount),
      bookingCount: bookings.length,
      activeBookings,
      nextCheckIn,
      nextCheckOut,
    }
  } catch (error) {
    console.error("Error fetching booking stats:", error)
    return {
      totalSpent: "$0",
      bookingCount: 0,
      activeBookings: 0,
      nextCheckIn: { date: null, propertyName: null },
      nextCheckOut: { date: null, daysLeft: null, propertyName: null },
    }
  }
}

