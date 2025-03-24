"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type BookingState = {
  propertyId: string | null
  checkInDate: Date | null
  checkOutDate: Date | null
  adults: number
  children: number
  infants: number
  totalNights: number
  basePrice: number
  totalPrice: number
  discountedPrice: number | null
  discountPercentage: number | null
}

type BookingActions = {
  setPropertyId: (id: string) => void
  setCheckInDate: (date: Date | null) => void
  setCheckOutDate: (date: Date | null) => void
  setAdults: (count: number) => void
  setChildren: (count: number) => void
  setInfants: (count: number) => void
  setPricing: (basePrice: number, discountPercentage?: number) => void
  calculateTotalPrice: () => void
  reset: () => void
}

const initialState: BookingState = {
  propertyId: null,
  checkInDate: null,
  checkOutDate: null,
  adults: 1,
  children: 0,
  infants: 0,
  totalNights: 0,
  basePrice: 0,
  totalPrice: 0,
  discountedPrice: null,
  discountPercentage: null,
}

const hydrateStore = (
  storedState: Partial<BookingState> | null
): Partial<BookingState> => {
  if (!storedState) return initialState

  return {
    ...storedState,
    checkInDate: storedState.checkInDate ? new Date(storedState.checkInDate) : null,
    checkOutDate: storedState.checkOutDate ? new Date(storedState.checkOutDate) : null,
  }
}

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setPropertyId: (id) => set({ propertyId: id }),
      setCheckInDate: (date) => {
        set({ checkInDate: date })
        get().calculateTotalPrice()
      },
      setCheckOutDate: (date) => {
        set({ checkOutDate: date })
        get().calculateTotalPrice()
      },
      setAdults: (count) => set({ adults: count }),
      setChildren: (count) => set({ children: count }),
      setInfants: (count) => set({ infants: count }),
      setPricing: (basePrice, discountPercentage = 0) => {
        set({
          basePrice,
          discountPercentage,
          discountedPrice: discountPercentage > 0 ? basePrice - basePrice * (discountPercentage / 100) : null,
        })
        get().calculateTotalPrice()
      },
      calculateTotalPrice: () => {
        const { checkInDate, checkOutDate, basePrice, discountPercentage } = get()
        
        if (!checkInDate || !checkOutDate) {
          set({ totalNights: 0, totalPrice: 0 })
          return
        }
        
        try {
          // Ensure we're working with valid Date objects
          const checkInTime = checkInDate instanceof Date ? checkInDate.getTime() : new Date(checkInDate).getTime()
          const checkOutTime = checkOutDate instanceof Date ? checkOutDate.getTime() : new Date(checkOutDate).getTime()
          
          if (isNaN(checkInTime) || isNaN(checkOutTime)) {
            console.error("Invalid date object", { checkInDate, checkOutDate })
            set({ totalNights: 0, totalPrice: 0 })
            return
          }
          
          const nights = Math.ceil((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24))
          
          const pricePerNight =
            discountPercentage && discountPercentage > 0
              ? basePrice - basePrice * (discountPercentage / 100)
              : basePrice
          
          set({
            totalNights: nights,
            totalPrice: pricePerNight * nights,
          })
        } catch (error) {
          console.error("Error calculating total price:", error)
          set({ totalNights: 0, totalPrice: 0 })
        }
      },
      reset: () => set(initialState),
    }),
    {
      name: "booking-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure dates are proper Date objects after rehydration
          if (state.checkInDate && !(state.checkInDate instanceof Date)) {
            state.checkInDate = new Date(state.checkInDate);
          }
          if (state.checkOutDate && !(state.checkOutDate instanceof Date)) {
            state.checkOutDate = new Date(state.checkOutDate);
          }
          
          // Recalculate total price with hydrated dates
          state.calculateTotalPrice();
        }
      },
    }
  ),
)