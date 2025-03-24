"use client"

import { getProperty, getPropertyReviews, getPropertyRooms } from "@/actions/property-detailed"
import { useQuery } from "@tanstack/react-query"

export const useProperty = (slug: string) => {
  const propertyQuery = useQuery({
    queryKey: ["property", slug],
    queryFn: async () => {
      const data = await getProperty(slug)
      return data || null
    },
  })

  return {
    property: propertyQuery.data,
    isLoading: propertyQuery.isPending,
    error: propertyQuery.error,
    refetch: propertyQuery.refetch,
  }
}

// Hook for fetching property rooms
export const usePropertyRooms = (propertyId: string) => {
  const roomsQuery = useQuery({
    queryKey: ["propertyRooms", propertyId],
    queryFn: async () => {
      const data = await getPropertyRooms(propertyId)
      return data || []
    },
    enabled: !!propertyId,
  })

  return {
    rooms: roomsQuery.data || [],
    isLoading: roomsQuery.isPending,
    error: roomsQuery.error,
    refetch: roomsQuery.refetch,
  }
}

// Hook for fetching property reviews
export const usePropertyReviews = (propertyId: string) => {
  const reviewsQuery = useQuery({
    queryKey: ["propertyReviews", propertyId],
    queryFn: async () => {
      const data = await getPropertyReviews(propertyId)
      return data || []
    },
    enabled: !!propertyId,
  })

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isPending,
    error: reviewsQuery.error,
    refetch: reviewsQuery.refetch,
  }
}

