"use client"

import { BookingStatus } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getReservationsByStatus, updateBookingStatus } from "@/actions/reservations"
import { toast } from "react-hot-toast"

// Hook for fetching reservations by status
export const useReservations = (status: BookingStatus) => {
  const reservationsQuery = useQuery({
    queryKey: ["reservations", status],
    queryFn: async () => {
      const data = await getReservationsByStatus(status)
      return data || []
    },
  })

  return {
    reservations: reservationsQuery.data || [],
    isLoading: reservationsQuery.isPending,
    error: reservationsQuery.error,
    refetch: reservationsQuery.refetch,
  }
}

// Hook for updating booking status
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string
      status: BookingStatus
    }) => {
      return await updateBookingStatus(bookingId, status)
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["reservations"] })

      // Show success message
      toast.success(
        variables.status === BookingStatus.CONFIRMED
          ? "Booking confirmed successfully!"
          : "Booking declined successfully!",
      )
    },
    onError: (error) => {
      console.error("Error updating booking status:", error)
      toast.error("Failed to update booking status. Please try again.")
    },
  })

  return mutation
}

