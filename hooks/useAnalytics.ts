"use client"

import { useQuery } from "@tanstack/react-query"
import { getAdminAnalytics, getHostAnalytics, getUserAnalytics } from "@/actions/analytics"

// Hook for fetching admin analytics
export const useAdminAnalytics = (timeframe: string) => {
  const analyticsQuery = useQuery({
    queryKey: ["adminAnalytics", timeframe],
    queryFn: async () => {
      const data = await getAdminAnalytics(timeframe)
      return (
        data || {
          metrics: {
            totalProperties: 0,
            totalUsers: 0,
            totalHosts: 0,
            periodBookings: 0,
            totalRevenue: "$0",
          },
          recentBookings: [],
          topHosts: [],
          bookingTrend: [],
        }
      )
    },
  })

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isPending,
    error: analyticsQuery.error,
    refetch: analyticsQuery.refetch,
  }
}

// Hook for fetching host analytics
export const useHostAnalytics = (timeframe: string) => {
  const analyticsQuery = useQuery({
    queryKey: ["hostAnalytics", timeframe],
    queryFn: async () => {
      const data = await getHostAnalytics(timeframe)
      return (
        data || {
          metrics: {
            totalProperties: 0,
            totalBookings: 0,
            periodBookings: 0,
            periodRevenue: "$0",
            totalRevenue: "$0",
          },
          upcomingBookings: [],
          topProperties: [],
          bookingTrend: [],
        }
      )
    },
  })

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isPending,
    error: analyticsQuery.error,
    refetch: analyticsQuery.refetch,
  }
}

// Hook for fetching user analytics
export const useUserAnalytics = (timeframe: string) => {
  const analyticsQuery = useQuery({
    queryKey: ["userAnalytics", timeframe],
    queryFn: async () => {
      const data = await getUserAnalytics(timeframe)
      return (
        data || {
          metrics: {
            totalBookings: 0,
            periodBookings: 0,
            periodSpending: "$0",
            totalSpending: "$0",
          },
          upcomingBookings: [],
          bookingHistory: [],
          spendingTrend: [],
        }
      )
    },
  })

  return {
    analytics: analyticsQuery.data,
    isLoading: analyticsQuery.isPending,
    error: analyticsQuery.error,
    refetch: analyticsQuery.refetch,
  }
}

