"use client"

import { useQuery } from "@tanstack/react-query"
import {  getPropertyRevenue, getUpcomingPayouts } from "@/actions/financials"

// Hook for fetching property revenue data
export const usePropertyRevenue = () => {
  const propertyRevenueQuery = useQuery({
    queryKey: ["propertyRevenue"],
    queryFn: async () => {
      const data = await getPropertyRevenue()
      return data || []
    },
  })

  return {
    properties: propertyRevenueQuery.data || [],
    isLoading: propertyRevenueQuery.isPending,
    error: propertyRevenueQuery.error,
    refetch: propertyRevenueQuery.refetch,
  }
}

// Hook for fetching upcoming payouts
export const useUpcomingPayouts = () => {
  const payoutsQuery = useQuery({
    queryKey: ["upcomingPayouts"],
    queryFn: async () => {
      const data = await getUpcomingPayouts()
      return data || []
    },
  })

  return {
    payouts: payoutsQuery.data || [],
    isLoading: payoutsQuery.isPending,
    error: payoutsQuery.error,
    refetch: payoutsQuery.refetch,
  }
}

