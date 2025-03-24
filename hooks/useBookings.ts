"use client"

import { getBookings, getBookingStats } from "@/actions/bookings"
import { getAllPropertyCategories, PropertyCategoryBasic } from "@/actions/property-category"
import { useQuery } from "@tanstack/react-query"

// Hook for fetching user bookings with filtering
export const useBookings = (status: string, timeframe: string) => {
  const bookingsQuery = useQuery({
    queryKey: ["bookings", status, timeframe],
    queryFn: async () => {
      const data = await getBookings(status, timeframe)
      return data || []
    },
  })

  return {
    bookings: bookingsQuery.data || [],
    isLoading: bookingsQuery.isPending,
    error: bookingsQuery.error,
    refetch: bookingsQuery.refetch,
  }
}

// Hook for fetching booking statistics
export const useBookingStats = (timeframe: string) => {
  const statsQuery = useQuery({
    queryKey: ["bookingStats", timeframe],
    queryFn: async () => {
      const data = await getBookingStats(timeframe)
      return (
        data || {
          totalSpent: "$0",
          bookingCount: 0,
          activeBookings: 0,
          nextCheckIn: { date: null, propertyName: null },
          nextCheckOut: { date: null, daysLeft: null, propertyName: null },
        }
      )
    },
  })

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isPending,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  }
}

export const usePropertyCategories = () => {
  const categoriesQuery = useQuery<PropertyCategoryBasic[]>({
    queryKey: ["propertyCategories"],
    queryFn: async () => {
      const data = await getAllPropertyCategories();
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isPending,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,
  };
};