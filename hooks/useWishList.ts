"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { addToWishlist, removeFromWishlist, getWishlistProperties, isPropertyInWishlist } from "@/actions/wishlist"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export interface WishlistProperty {
  id: string
  title: string
  slug: string
  isFeatured: boolean
  images: string[]
  host?: {
    id: string
    name: string
  }
  address?: {
    city: string
    country: string
  }
  pricing?: {
    basePrice: number | string // Handle both string and number
    currency: string
  }
  avgRating?: number | string | null // Handle possible null values
}

// Hook for handling wishlist operations with React Query
export function useWishlist() {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Fetch wishlist properties
  const { 
    data: wishlistPropertiesRaw = [], 
    isLoading: isLoadingWishlist,
    isError: isWishlistError,
    error: wishlistError
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const result = await getWishlistProperties()
      
      if (result.requiresAuth) {
        router.push("/login?callbackUrl=/wishlist")
        return []
      }
      
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch wishlist")
      }
      
      // Process the data to ensure all properties have the right format
      return result.data || []
    }
  })
  
  // Additional normalization to ensure values are in the right format
  const wishlistProperties = wishlistPropertiesRaw.map((property: any) => ({
    ...property,
    pricing: property.pricing ? {
      basePrice: property.pricing.basePrice ? Number(property.pricing.basePrice) : 0,
      currency: property.pricing.currency || 'USD'
    } : { basePrice: 0, currency: 'USD' },
    avgRating: property.avgRating ? Number(property.avgRating) : 0
  }))

  // Check if a property is in wishlist
  const checkWishlistStatus = async (propertyId: string) => {
    const result = await isPropertyInWishlist(propertyId)
    return result.isInWishlist
  }

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: addToWishlist,
    onMutate: async (propertyId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] })
      await queryClient.cancelQueries({ queryKey: ["wishlistStatus", propertyId] })

      // Set optimistic update for wishlist status
      queryClient.setQueryData(
        ["wishlistStatus", propertyId],
        true
      )

      return { propertyId }
    },
    onSuccess: (result, propertyId) => {
      if (result.requiresAuth) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (!result.success) {
        toast.error(result.error || "Failed to add to wishlist")
        return
      }

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
      queryClient.invalidateQueries({ queryKey: ["wishlistStatus", propertyId] })
      
      toast.success("Property has been added to your wishlist")
    },
    onError: (error, propertyId) => {
      // Revert optimistic update
      queryClient.setQueryData(
        ["wishlistStatus", propertyId],
        false
      )
      
      toast.error("Login First | Check Your Connection")
    }
  })

  // Remove from wishlist mutation
  const removeFromWishlistMutation = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async (propertyId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlist"] })
      await queryClient.cancelQueries({ queryKey: ["wishlistStatus", propertyId] })

      // Set optimistic update for wishlist status
      queryClient.setQueryData(
        ["wishlistStatus", propertyId],
        false
      )

      // Optimistically remove from wishlist
      const previousWishlist = queryClient.getQueryData<WishlistProperty[]>(["wishlist"])
      if (previousWishlist) {
        queryClient.setQueryData(
          ["wishlist"],
          previousWishlist.filter(prop => prop.id !== propertyId)
        )
      }

      return { propertyId, previousWishlist }
    },
    onSuccess: (result, propertyId) => {
      if (result.requiresAuth) {
        router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
        return
      }

      if (!result.success) {
        toast.error(result.error || "Failed to remove from wishlist")
        return
      }

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["wishlist"] })
      queryClient.invalidateQueries({ queryKey: ["wishlistStatus", propertyId] })
      
      toast.success("Property has been removed from your wishlist")
    },
    onError: (error, propertyId, context) => {
      // Revert optimistic updates
      if (context?.previousWishlist) {
        queryClient.setQueryData(["wishlist"], context.previousWishlist)
      }
      
      queryClient.setQueryData(
        ["wishlistStatus", propertyId],
        true
      )
      
      toast.error("Failed to remove from wishlist")
    }
  })

  // Utility hook for property's wishlist status
  const usePropertyWishlistStatus = (propertyId: string) => {
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const { data, isLoading: queryLoading } = useQuery({
      queryKey: ["wishlistStatus", propertyId],
      queryFn: () => checkWishlistStatus(propertyId),
      enabled: !!propertyId
    })

    useEffect(() => {
      if (!queryLoading) {
        setIsInWishlist(!!data)
        setIsLoading(false)
      }
    }, [data, queryLoading])

    return {
      isInWishlist,
      isLoading,
      toggleWishlist: () => {
        if (isInWishlist) {
          removeFromWishlistMutation.mutate(propertyId)
          setIsInWishlist(false) // Optimistic update
        } else {
          addToWishlistMutation.mutate(propertyId)
          setIsInWishlist(true) // Optimistic update
        }
      }
    }
  }

  return {
    wishlistProperties,
    isLoadingWishlist,
    isWishlistError,
    wishlistError,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    usePropertyWishlistStatus
  }
}