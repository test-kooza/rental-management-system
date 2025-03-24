import { UserProp } from './../types/types';
"use server"

import { db } from "@/prisma/db"
import { BookingStatus, SystemRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { addDays, endOfMonth, format, startOfMonth, startOfToday, subDays } from "date-fns"
import { getAuthenticatedUser } from "@/config/useAuth"



export async function getReservationStats() {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      throw new Error("Unauthorized")
    }
    
    const today = new Date()
    const startOfCurrentMonth = startOfMonth(today)
    const endOfCurrentMonth = endOfMonth(today)
    
    // Base query - will be modified based on user role
    let propertyQuery = {}
    
    // If user is a HOST, only show their properties
    if (user.role === SystemRole.HOST) {
      propertyQuery = {
        where: { 
          hostId: user.id 
        }
      }
    }
    
    // Get properties based on user role
    const properties = await db.property.findMany({
      ...propertyQuery,
      select: { id: true },
    })
    
    // If no properties found
    if (properties.length === 0) {
      return {
        occupancyRate: 0,
        upcomingReservations: 0,
        todayCheckIns: 0,
        todayCheckOuts: 0,
        pendingRequests: 0,
        chartData: [],
      }
    }
    
    // Get property IDs for filtering bookings
    const propertyIds = properties.map(property => property.id)
    
    // Base booking query filter - will be used in all booking queries
    const bookingFilter = user.role === SystemRole.HOST 
      ? { propertyId: { in: propertyIds } }
      : {}
    
    // Get current month bookings
    const currentMonthBookings = await db.booking.count({
      where: {
        checkInDate: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
        status: BookingStatus.CONFIRMED,
        ...bookingFilter,
      },
    })
    
    const daysInMonth = endOfCurrentMonth.getDate()
    const totalPossibleDays = properties.length * daysInMonth
    const occupancyRate = totalPossibleDays > 0 ? Math.round((currentMonthBookings / totalPossibleDays) * 100) : 0
    
    // Get upcoming reservations count
    const upcomingReservations = await db.booking.count({
      where: {
        checkInDate: {
          gte: today,
        },
        status: BookingStatus.CONFIRMED,
        ...bookingFilter,
      },
    })
    
    // Get today's check-ins
    const todayCheckIns = await db.booking.count({
      where: {
        checkInDate: {
          gte: startOfToday(),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: BookingStatus.CONFIRMED,
        ...bookingFilter,
      },
    })
    
    // Get today's check-outs
    const todayCheckOuts = await db.booking.count({
      where: {
        checkOutDate: {
          gte: startOfToday(),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: BookingStatus.CONFIRMED,
        ...bookingFilter,
      },
    })
    
    // Get pending booking requests
    const pendingRequests = await db.booking.count({
      where: {
        status: BookingStatus.PENDING,
        ...bookingFilter,
      },
    })
    
    // Generate chart data for the last 30 days
    const chartData = await generateChartData(user)
    
    return {
      occupancyRate,
      upcomingReservations,
      todayCheckIns,
      todayCheckOuts,
      pendingRequests,
      chartData,
    }
  } catch (error) {
    console.error("Error fetching reservation stats:", error)
    return {
      occupancyRate: 0,
      upcomingReservations: 0,
      todayCheckIns: 0,
      todayCheckOuts: 0,
      pendingRequests: 0,
      chartData: [],
    }
  }
}

// Generate chart data for the last 30 days
async function generateChartData(user:UserProp) {
  const today = new Date()
  const thirtyDaysAgo = subDays(today, 29)
  
  // Create an array of the last 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(thirtyDaysAgo, i)
    return {
      date: format(date, "MMM d"),
      fullDate: date,
      bookings: 0,
    }
  })
  
  // Base query filter based on user role
  let bookingFilter = {}
  
  if (user.role === SystemRole.HOST) {
    // First get the host's properties
    const hostProperties = await db.property.findMany({
      where: { hostId: user.id },
      select: { id: true },
    })
    
    const propertyIds = hostProperties.map(property => property.id)
    
    // Then filter bookings by those property IDs
    bookingFilter = {
      propertyId: { in: propertyIds }
    }
  }
  
  // Get bookings created in the last 30 days
  const bookings = await db.booking.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
        lte: today,
      },
      ...bookingFilter,
    },
    select: {
      createdAt: true,
    },
  })
  
  // Count bookings for each day
  bookings.forEach((booking) => {
    const bookingDate = booking.createdAt
    const dateIndex = dates.findIndex((d) => format(d.fullDate, "yyyy-MM-dd") === format(bookingDate, "yyyy-MM-dd"))
    
    if (dateIndex !== -1) {
      dates[dateIndex].bookings += 1
    }
  })
  
  // Return formatted data without the fullDate property
  return dates.map(({ date, bookings }) => ({ date, bookings }))
}

// Get today's check-ins and check-outs
export async function getTodayActivity() {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      throw new Error("Unauthorized")
    }
    
    const today = new Date()
    const startOfDay = startOfToday()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))
    
    // Base query filter based on user role
    let propertyFilter = {}
    
    if (user.role === SystemRole.HOST) {
      // Get the host's properties IDs
      const hostProperties = await db.property.findMany({
        where: { hostId: user.id },
        select: { id: true },
      })
      
      const propertyIds = hostProperties.map(property => property.id)
      
      propertyFilter = {
        propertyId: { in: propertyIds }
      }
    }
    
    // Get today's check-ins
    const checkIns = await db.booking.findMany({
      where: {
        checkInDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: BookingStatus.CONFIRMED,
        ...propertyFilter,
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: {
        checkInDate: "asc",
      },
    })
    
    // Get today's check-outs
    const checkOuts = await db.booking.findMany({
      where: {
        checkOutDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: BookingStatus.CONFIRMED,
        ...propertyFilter,
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: {
        checkOutDate: "asc",
      },
    })
    
    return {
      checkIns,
      checkOuts,
    }
  } catch (error) {
    console.error("Error fetching today's activity:", error)
    return {
      checkIns: [],
      checkOuts: [],
    }
  }
}

// Get reservations by status
export async function getReservationsByStatus(status: BookingStatus) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      throw new Error("Unauthorized")
    }
    
    // Base query filter based on user role
    let propertyFilter = {}
    
    if (user.role === SystemRole.HOST) {
      // Get the host's properties IDs
      const hostProperties = await db.property.findMany({
        where: { hostId: user.id },
        select: { id: true },
      })
      
      const propertyIds = hostProperties.map(property => property.id)
      
      propertyFilter = {
        propertyId: { in: propertyIds }
      }
    }
    
    const reservations = await db.booking.findMany({
      where: {
        status,
        ...propertyFilter,
      },
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
          },
        },
      },
      orderBy: {
        checkInDate: "asc",
      },
    })
    
    return reservations
  } catch (error) {
    console.error(`Error fetching ${status} reservations:`, error)
    throw new Error(`Failed to fetch ${status} reservations`)
  }
}

// Update booking status
export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  try {
    const user = await getAuthenticatedUser()
    
    if (!user) {
      throw new Error("Unauthorized")
    }
    
    // Get booking first to verify ownership if user is a HOST
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: {
          select: { hostId: true }
        }
      }
    })
    
    if (!booking) {
      throw new Error("Booking not found")
    }
    
    // Verify the HOST owns this property
    if (user.role === SystemRole.HOST && booking.property.hostId !== user.id) {
      throw new Error("Unauthorized: You do not own this property")
    }
    
    // Update the booking status
    const updatedBooking = await db.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status,
      },
    })
    
    // Create notification for the guest
    await db.notification.create({
      data: {
        type: status === BookingStatus.CONFIRMED ? "BOOKING_CONFIRMED" : "BOOKING_CANCELLED",
        title: status === BookingStatus.CONFIRMED ? "Booking Confirmed" : "Booking Declined",
        message:
          status === BookingStatus.CONFIRMED
            ? "Your booking request has been confirmed by the host."
            : "Your booking request has been declined by the host.",
        guestId: updatedBooking.guestId,
        bookingId: updatedBooking.id,
      },
    })
    
    revalidatePath("/dashboard/reservation-overview")
    return updatedBooking
  } catch (error) {
    console.error(`Error updating booking status:`, error)
    throw new Error(`Failed to update booking status: ${error}`)
  }
}