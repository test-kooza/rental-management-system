"use server"

import { getAuthenticatedUser } from "@/config/useAuth"
import { db } from "@/prisma/db"
import { BookingStatus, SystemRole } from "@prisma/client"
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  startOfYear,
  endOfYear,
  subYears,
} from "date-fns"

// Format currency
const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to get current user data
async function getAuthenticatedUserData() {
  try {
    const user = await getAuthenticatedUser()
    return {
      userId: user.id,
      role: user.role,
    }
  } catch (error) {
    console.error("Error getting authenticated user:", error)
    throw new Error("Unauthorized")
  }
}

export async function getFinancialStats() {
  try {
    const { userId, role } = await getAuthenticatedUserData()
    
    // Get current and previous month's date range
    const today = new Date()
    const currentMonthStart = startOfMonth(today)
    const currentMonthEnd = endOfMonth(today)
    const previousMonthStart = startOfMonth(subMonths(today, 1))
    const previousMonthEnd = endOfMonth(subMonths(today, 1))

    // Add role-based filtering
    const hostFilter = role === SystemRole.ADMIN ? {} : { hostId: userId }
    
    // Get properties with role-based filtering
    const properties = await db.property.findMany({
      where: hostFilter,
      include: {
        pricing: true,
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            },
            checkInDate: {
              gte: subMonths(today, 1),
            },
          },
        },
      },
    })

    // Get property IDs for the current user or all properties for admin
    const propertyIds = properties.map(property => property.id)
    
    // Get current month's revenue with property filtering
    const currentMonthBookings = await db.booking.findMany({
      where: {
        propertyId: {
          in: propertyIds,
        },
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      select: {
        totalAmount: true,
        currency: true,
      },
    })

    const currentMonthRevenue = currentMonthBookings.reduce((total, booking) => total + Number(booking.totalAmount), 0)

    // Get previous month's revenue with property filtering
    const previousMonthBookings = await db.booking.findMany({
      where: {
        propertyId: {
          in: propertyIds,
        },
        createdAt: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      select: {
        totalAmount: true,
        currency: true,
      },
    })

    const previousMonthRevenue = previousMonthBookings.reduce(
      (total, booking) => total + Number(booking.totalAmount),
      0,
    )

    // Calculate revenue change percentage
    const revenueChange =
      previousMonthRevenue === 0
        ? 100
        : Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)

    // Get upcoming payouts with role-based filtering
    const payoutFilter = role === SystemRole.ADMIN 
      ? { status: "PENDING" } 
      : { status: "PENDING", hostId: userId }
    
    const upcomingPayouts = await db.payout.findMany({
      where: payoutFilter,
      select: {
        id: true,
        amount: true,
        currency: true,
        periodStart: true,
        periodEnd: true,
      },
      orderBy: {
        periodEnd: "asc",
      },
      take: 1,
    })

    const totalUpcomingPayouts = upcomingPayouts.reduce((total, payout) => total + Number(payout.amount), 0)

    const nextPayoutDate =
      upcomingPayouts.length > 0 && upcomingPayouts[0].periodEnd
        ? format(new Date(upcomingPayouts[0].periodEnd), "MMM d, yyyy")
        : "No scheduled payouts"

    const propertyCount = properties.length

    // Calculate ADR (Average Daily Rate)
    let totalBasePrice = 0
    let totalBookingDays = 0

    properties.forEach((property) => {
      property.bookings.forEach((booking) => {
        const checkInDate = new Date(booking.checkInDate)
        const checkOutDate = new Date(booking.checkOutDate)
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

        totalBasePrice += Number(booking.basePrice) * nights
        totalBookingDays += nights
      })
    })

    const averageDailyRate = totalBookingDays > 0 ? totalBasePrice / totalBookingDays : 0

    // Calculate RevPAR (Revenue Per Available Room)
    const totalAvailableRoomNights = properties.reduce((total, property) => {
      // Calculate 30 days of availability for each property
      return total + 30 * property.bedrooms
    }, 0)

    const revPAR = totalAvailableRoomNights > 0 ? currentMonthRevenue / totalAvailableRoomNights : 0

    return {
      currentMonthRevenue: {
        value: currentMonthRevenue,
        formatted: formatCurrency(currentMonthRevenue),
      },
      revenueChange,
      upcomingPayouts: {
        value: totalUpcomingPayouts,
        formatted: formatCurrency(totalUpcomingPayouts),
      },
      nextPayoutDate,
      averageDailyRate: {
        value: averageDailyRate,
        formatted: formatCurrency(averageDailyRate),
      },
      revPAR: {
        value: revPAR,
        formatted: formatCurrency(revPAR),
      },
      propertyCount,
    }
  } catch (error) {
    console.error("Error fetching financial stats:", error)
    return {
      currentMonthRevenue: { value: 0, formatted: "$0" },
      revenueChange: 0,
      upcomingPayouts: { value: 0, formatted: "$0" },
      nextPayoutDate: "N/A",
      averageDailyRate: { value: 0, formatted: "$0" },
      revPAR: { value: 0, formatted: "$0" },
      propertyCount: 0,
    }
  }
}

export async function getMonthlyRevenueData() {
  try {
    const { userId, role } = await getAuthenticatedUserData()
    
    const today = new Date()
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i)
      return {
        month: format(date, "MMM yyyy"),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
        revenue: 0,
        formattedRevenue: "$0",
      }
    })

    // Filter properties by host if not admin
    const hostFilter = role === SystemRole.ADMIN ? {} : { hostId: userId }
    
    // Get properties for this user
    const properties = await db.property.findMany({
      where: hostFilter,
      select: { id: true },
    })
    
    const propertyIds = properties.map(property => property.id)
    
    // Get filtered bookings for the last 12 months
    const bookings = await db.booking.findMany({
      where: {
        propertyId: {
          in: propertyIds,
        },
        createdAt: {
          gte: months[0].startDate,
          lte: months[11].endDate,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      select: {
        createdAt: true,
        totalAmount: true,
        currency: true,
      },
    })

    // Calculate revenue for each month
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt)
      const monthIndex = months.findIndex((m) => bookingDate >= m.startDate && bookingDate <= m.endDate)

      if (monthIndex !== -1) {
        months[monthIndex].revenue += Number(booking.totalAmount)
      }
    })

    // Format revenue
    months.forEach((month) => {
      month.formattedRevenue = formatCurrency(month.revenue)
    })

    // Return formatted data without the date objects
    return months.map(({ month, revenue, formattedRevenue }) => ({
      month,
      revenue,
      formattedRevenue,
    }))
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error)
    return Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i)
      return {
        month: format(date, "MMM yyyy"),
        revenue: 0,
        formattedRevenue: "$0",
      }
    })
  }
}

export async function getMetricsComparisonData() {
  try {
    const { userId, role } = await getAuthenticatedUserData()
    
    const today = new Date()

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i)
      return {
        period: format(date, "MMM yyyy"),
        startDate: startOfMonth(date),
        endDate: endOfMonth(date),
        adr: 0,
        revpar: 0,
        formattedADR: "$0",
        formattedRevPAR: "$0",
      }
    })

    const quarterlyData = Array.from({ length: 4 }, (_, i) => {
      const date = subQuarters(today, 3 - i)
      return {
        period: `Q${i + 1} ${format(date, "yyyy")}`,
        startDate: startOfQuarter(date),
        endDate: endOfQuarter(date),
        adr: 0,
        revpar: 0,
        formattedADR: "$0",
        formattedRevPAR: "$0",
      }
    })

    // Generate yearly data
    const yearlyData = Array.from({ length: 3 }, (_, i) => {
      const date = subYears(today, 2 - i)
      return {
        period: format(date, "yyyy"),
        startDate: startOfYear(date),
        endDate: endOfYear(date),
        adr: 0,
        revpar: 0,
        formattedADR: "$0",
        formattedRevPAR: "$0",
      }
    })

    const hostFilter = role === SystemRole.ADMIN ? {} : { hostId: userId }

    const properties = await db.property.findMany({
      where: hostFilter,
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            },
            checkInDate: {
              gte: yearlyData[0].startDate,
            },
          },
        },
      },
    })

    // Calculate metrics for each period
    const calculateMetrics = (data: any[], bookings: any[]) => {
      data.forEach((period) => {
        let totalRevenue = 0
        let totalNights = 0
        let totalRooms = 0

        bookings.forEach((booking) => {
          const bookingDate = new Date(booking.checkInDate)
          if (bookingDate >= period.startDate && bookingDate <= period.endDate) {
            const checkInDate = new Date(booking.checkInDate)
            const checkOutDate = new Date(booking.checkOutDate)
            const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

            totalRevenue += Number(booking.totalAmount)
            totalNights += nights
          }
        })

        // Calculate total available rooms for the period
        properties.forEach((property) => {
          const daysInPeriod = Math.ceil(
            (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24),
          )
          totalRooms += property.bedrooms * daysInPeriod
        })

        // Calculate ADR and RevPAR
        period.adr = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0
        period.revpar = totalRooms > 0 ? Math.round(totalRevenue / totalRooms) : 0
        period.formattedADR = formatCurrency(period.adr)
        period.formattedRevPAR = formatCurrency(period.revpar)
      })
    }

    // Flatten all bookings
    const allBookings = properties.flatMap((property) => property.bookings)

    // Calculate metrics for each time period
    calculateMetrics(monthlyData, allBookings)
    calculateMetrics(quarterlyData, allBookings)
    calculateMetrics(yearlyData, allBookings)

    // Return formatted data without the date objects
    return {
      monthly: monthlyData.map(({ period, adr, revpar, formattedADR, formattedRevPAR }) => ({
        period,
        adr,
        revpar,
        formattedADR,
        formattedRevPAR,
      })),
      quarterly: quarterlyData.map(({ period, adr, revpar, formattedADR, formattedRevPAR }) => ({
        period,
        adr,
        revpar,
        formattedADR,
        formattedRevPAR,
      })),
      yearly: yearlyData.map(({ period, adr, revpar, formattedADR, formattedRevPAR }) => ({
        period,
        adr,
        revpar,
        formattedADR,
        formattedRevPAR,
      })),
    }
  } catch (error) {
    console.error("Error fetching metrics comparison data:", error)
    return {
      monthly: [],
      quarterly: [],
      yearly: [],
    }
  }
}

// Get property revenue data - filtered by user role
export async function getPropertyRevenue() {
  try {
    const { userId, role } = await getAuthenticatedUserData()
    
    const today = new Date()
    const startDate = subMonths(today, 1)

    // Add role-based filtering
    const hostFilter = role === SystemRole.ADMIN ? {} : { hostId: userId }

    // Get properties with bookings, filtered by role
    const properties = await db.property.findMany({
      where: hostFilter,
      include: {
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            },
            checkInDate: {
              gte: startDate,
            },
          },
        },
      },
    })

    // Calculate revenue and occupancy for each property
    const propertyRevenue = properties.map((property) => {
      // Calculate total revenue
      const revenue = property.bookings.reduce((total, booking) => total + Number(booking.totalAmount), 0)

      // Calculate occupancy rate
      const daysInPeriod = 30 // Last 30 days
      const totalAvailableDays = daysInPeriod

      let bookedDays = 0
      property.bookings.forEach((booking) => {
        const checkInDate = new Date(booking.checkInDate)
        const checkOutDate = new Date(booking.checkOutDate)
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        bookedDays += nights
      })

      const occupancyRate = Math.min(Math.round((bookedDays / totalAvailableDays) * 100), 100)

      return {
        id: property.id,
        title: property.title,
        image: property.images && property.images.length > 0 ? property.images[0] : null,
        revenue,
        formattedRevenue: formatCurrency(revenue),
        occupancyRate,
      }
    })

    return propertyRevenue
  } catch (error) {
    console.error("Error fetching property revenue:", error)
    return []
  }
}

// Get upcoming payouts - filtered by user role
export async function getUpcomingPayouts() {
  try {
    const { userId, role } = await getAuthenticatedUserData()
    
    // Add role-based filtering
    const payoutFilter = role === SystemRole.ADMIN 
      ? {} 
      : { hostId: userId }
    
    const payouts = await db.payout.findMany({
      where: payoutFilter,
      orderBy: {
        periodEnd: "asc",
      },
      take: 5,
    })

    return payouts.map((payout) => ({
      id: payout.id,
      amount: Number(payout.amount),
      formattedAmount: formatCurrency(Number(payout.amount), payout.currency),
      currency: payout.currency,
      status: payout.status,
      description: payout.description || "Payout for completed bookings",
      periodStart: payout.periodStart || new Date(),
      periodEnd: payout.periodEnd || new Date(),
    }))
  } catch (error) {
    console.error("Error fetching upcoming payouts:", error)
    return []
  }
}