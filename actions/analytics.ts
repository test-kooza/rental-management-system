"use server"

import { db } from "@/prisma/db"
import { BookingStatus, SystemRole } from "@prisma/client"
import { startOfDay, endOfDay, subWeeks, subMonths, subYears, format } from "date-fns"
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

// Get date range based on timeframe
const getDateRange = (timeframe: string) => {
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

  return {
    startDate,
    endDate: endOfDay(today),
  }
}

// Admin Analytics
export async function getAdminAnalytics(timeframe: string) {
  try {
    const { role } = await getAuthenticatedUser()

    if (role !== SystemRole.ADMIN) {
      throw new Error("Unauthorized access")
    }

    const { startDate, endDate } = getDateRange(timeframe)

    // Date filter for queries
    const dateFilter = startDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}

    // Get total properties
    const totalProperties = await db.property.count()

    // Get total users
    const totalUsers = await db.user.count()

    // Get total hosts
    const totalHosts = await db.user.count({
      where: {
        systemRole: SystemRole.HOST,
      },
    })

    // Get total bookings in period
    const periodBookings = await db.booking.count({
      where: {
        ...dateFilter,
      },
    })

    // Get total revenue in period
    const revenueData = await db.booking.aggregate({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
        ...dateFilter,
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalRevenue = revenueData._sum.totalAmount ? Number(revenueData._sum.totalAmount) : 0

    // Get recent bookings
    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        guest: true,
        property: true,
      },
    })

    // Get top hosts by property count
    const topHosts = await db.user.findMany({
      where: {
        systemRole: SystemRole.HOST,
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            properties: true,
          },
        },
      },
      orderBy: {
        properties: {
          _count: "desc",
        },
      },
      take: 5,
    })

    // Get booking trend data for chart
    const bookingTrend =
      timeframe === "today"
        ? await getHourlyBookings(startDate!, endDate)
        : timeframe === "week"
          ? await getDailyBookings(startDate!, endDate)
          : timeframe === "month"
            ? await getDailyBookings(startDate!, endDate)
            : await getMonthlyBookings(startDate!, endDate)

    return {
      metrics: {
        totalProperties,
        totalUsers,
        totalHosts,
        periodBookings,
        totalRevenue: formatCurrency(totalRevenue),
      },
      recentBookings: recentBookings.map((booking) => ({
        id: booking.id,
        guestName: booking.guest.name,
        guestImage: booking.guest.image,
        propertyTitle: booking.property.title,
        checkInDate: format(new Date(booking.checkInDate), "MMM dd, yyyy"),
        checkOutDate: format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
        amount: formatCurrency(Number(booking.totalAmount)),
        status: booking.status,
      })),
      topHosts: topHosts.map((host) => ({
        id: host.id,
        name: host.name,
        image: host.image,
        propertyCount: host._count.properties,
      })),
      bookingTrend,
    }
  } catch (error) {
    console.error("Error fetching admin analytics:", error)
    return null
  }
}

// Host Analytics
export async function getHostAnalytics(timeframe: string) {
  try {
    const { id: userId, role } = await getAuthenticatedUser()

    if (role !== SystemRole.HOST) {
      throw new Error("Unauthorized access")
    }

    const { startDate, endDate } = getDateRange(timeframe)

    // Date filter for queries
    const dateFilter = startDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}

    // Get total properties
    const totalProperties = await db.property.count({
      where: {
        hostId: userId,
      },
    })

    // Get total bookings
    const totalBookings = await db.booking.count({
      where: {
        property: {
          hostId: userId,
        },
      },
    })

    // Get period bookings
    const periodBookings = await db.booking.count({
      where: {
        property: {
          hostId: userId,
        },
        ...dateFilter,
      },
    })

    // Get revenue data
    const revenueData = await db.booking.aggregate({
      where: {
        property: {
          hostId: userId,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
        ...dateFilter,
      },
      _sum: {
        totalAmount: true,
      },
    })

    const periodRevenue = revenueData._sum.totalAmount ? Number(revenueData._sum.totalAmount) : 0

    // Get total revenue (all time)
    const totalRevenueData = await db.booking.aggregate({
      where: {
        property: {
          hostId: userId,
        },
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalRevenue = totalRevenueData._sum.totalAmount ? Number(totalRevenueData._sum.totalAmount) : 0

    // Get upcoming bookings
    const upcomingBookings = await db.booking.findMany({
      where: {
        property: {
          hostId: userId,
        },
        status: BookingStatus.CONFIRMED,
        checkInDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        checkInDate: "asc",
      },
      take: 5,
      include: {
        guest: true,
        property: true,
      },
    })

    // Get top properties by booking count
    const topProperties = await db.property.findMany({
      where: {
        hostId: userId,
      },
      select: {
        id: true,
        title: true,
        images: true,
        _count: {
          select: {
            bookings: true,
          },
        },
        bookings: {
          where: {
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
            },
          },
          select: {
            totalAmount: true,
          },
        },
      },
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
      take: 5,
    })

    // Calculate revenue for each property
    const topPropertiesWithRevenue = topProperties.map((property) => {
      const revenue = property.bookings.reduce((sum, booking) => sum + Number(booking.totalAmount), 0)
      return {
        id: property.id,
        title: property.title,
        image: property.images[0] || null,
        bookingCount: property._count.bookings,
        revenue: formatCurrency(revenue),
      }
    })

    // Get booking trend data for chart
    const bookingTrend =
      timeframe === "today"
        ? await getHourlyBookings(startDate!, endDate, userId)
        : timeframe === "week"
          ? await getDailyBookings(startDate!, endDate, userId)
          : timeframe === "month"
            ? await getDailyBookings(startDate!, endDate, userId)
            : await getMonthlyBookings(startDate!, endDate, userId)

    return {
      metrics: {
        totalProperties,
        totalBookings,
        periodBookings,
        periodRevenue: formatCurrency(periodRevenue),
        totalRevenue: formatCurrency(totalRevenue),
      },
      upcomingBookings: upcomingBookings.map((booking) => ({
        id: booking.id,
        guestName: booking.guest.name,
        guestImage: booking.guest.image,
        propertyTitle: booking.property.title,
        checkInDate: format(new Date(booking.checkInDate), "MMM dd, yyyy"),
        checkOutDate: format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
        amount: formatCurrency(Number(booking.totalAmount)),
        status: booking.status,
      })),
      topProperties: topPropertiesWithRevenue,
      bookingTrend,
    }
  } catch (error) {
    console.error("Error fetching host analytics:", error)
    return null
  }
}

// User Analytics
export async function getUserAnalytics(timeframe: string) {
  try {
    const { id: userId } = await getAuthenticatedUser()

    const { startDate, endDate } = getDateRange(timeframe)

    // Date filter for queries
    const dateFilter = startDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {}

    // Get total bookings
    const totalBookings = await db.booking.count({
      where: {
        guestId: userId,
      },
    })

    // Get period bookings
    const periodBookings = await db.booking.count({
      where: {
        guestId: userId,
        ...dateFilter,
      },
    })

    // Get spending data
    const spendingData = await db.booking.aggregate({
      where: {
        guestId: userId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
        ...dateFilter,
      },
      _sum: {
        totalAmount: true,
      },
    })

    const periodSpending = spendingData._sum.totalAmount ? Number(spendingData._sum.totalAmount) : 0

    // Get total spending (all time)
    const totalSpendingData = await db.booking.aggregate({
      where: {
        guestId: userId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      _sum: {
        totalAmount: true,
      },
    })

    const totalSpending = totalSpendingData._sum.totalAmount ? Number(totalSpendingData._sum.totalAmount) : 0

    // Get upcoming bookings
    const upcomingBookings = await db.booking.findMany({
      where: {
        guestId: userId,
        status: BookingStatus.CONFIRMED,
        checkInDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        checkInDate: "asc",
      },
      take: 5,
      include: {
        property: {
          include: {
            host: true,
          },
        },
      },
    })

    // Get booking history
    const bookingHistory = await db.booking.findMany({
      where: {
        guestId: userId,
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        property: true,
      },
    })

    // Get spending trend data for chart
    const spendingTrend =
      timeframe === "today"
        ? await getHourlySpending(startDate!, endDate, userId)
        : timeframe === "week"
          ? await getDailySpending(startDate!, endDate, userId)
          : timeframe === "month"
            ? await getDailySpending(startDate!, endDate, userId)
            : await getMonthlySpending(startDate!, endDate, userId)

    return {
      metrics: {
        totalBookings,
        periodBookings,
        periodSpending: formatCurrency(periodSpending),
        totalSpending: formatCurrency(totalSpending),
      },
      upcomingBookings: upcomingBookings.map((booking) => ({
        id: booking.id,
        propertyTitle: booking.property.title,
        propertyImage: booking.property.images[0] || null,
        hostName: booking.property.host.name,
        checkInDate: format(new Date(booking.checkInDate), "MMM dd, yyyy"),
        checkOutDate: format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
        amount: formatCurrency(Number(booking.totalAmount)),
      })),
      bookingHistory: bookingHistory.map((booking) => ({
        id: booking.id,
        propertyTitle: booking.property.title,
        propertyImage: booking.property.images[0] || null,
        checkInDate: format(new Date(booking.checkInDate), "MMM dd, yyyy"),
        checkOutDate: format(new Date(booking.checkOutDate), "MMM dd, yyyy"),
        amount: formatCurrency(Number(booking.totalAmount)),
        status: booking.status,
      })),
      spendingTrend,
    }
  } catch (error) {
    console.error("Error fetching user analytics:", error)
    return null
  }
}

// Helper functions for chart data

// Get hourly bookings/spending
async function getHourlyBookings(startDate: Date, endDate: Date, hostId?: string) {
  // Implementation would aggregate bookings by hour
  // This is a simplified version
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return hours.map((hour) => ({
    hour: `${hour}:00`,
    bookings: Math.floor(Math.random() * 10),
  }))
}

async function getHourlySpending(startDate: Date, endDate: Date, userId: string) {
  // Implementation would aggregate spending by hour
  // This is a simplified version
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return hours.map((hour) => ({
    hour: `${hour}:00`,
    spending: Math.floor(Math.random() * 500),
  }))
}

// Get daily bookings/spending
async function getDailyBookings(startDate: Date, endDate: Date, hostId?: string) {
  // Implementation would aggregate bookings by day
  // This is a simplified version
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return format(date, "MMM dd")
  })

  return days.map((day) => ({
    day,
    bookings: Math.floor(Math.random() * 20),
  }))
}

async function getDailySpending(startDate: Date, endDate: Date, userId: string) {
  // Implementation would aggregate spending by day
  // This is a simplified version
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    return format(date, "MMM dd")
  })

  return days.map((day) => ({
    day,
    spending: Math.floor(Math.random() * 1000),
  }))
}

// Get monthly bookings/spending
async function getMonthlyBookings(startDate: Date, endDate: Date, hostId?: string) {
  // Implementation would aggregate bookings by month
  // This is a simplified version
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return months.map((month) => ({
    month,
    bookings: Math.floor(Math.random() * 50),
  }))
}

async function getMonthlySpending(startDate: Date, endDate: Date, userId: string) {
  // Implementation would aggregate spending by month
  // This is a simplified version
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return months.map((month) => ({
    month,
    spending: Math.floor(Math.random() * 5000),
  }))
}

