"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Calendar } from "lucide-react"
import { useBookingStore } from "@/store/use-booking"
import { format } from "date-fns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import DateRangePicker from "../dashboard/DateRangePicker"

interface PropertyFooterProps {
  originalPrice: string
  discountedPrice: string
  onReserve: () => void
  propertyAvailable?: boolean
}

const PropertyFooter: React.FC<PropertyFooterProps> = ({ 
  originalPrice, 
  discountedPrice, 
  onReserve,
  propertyAvailable = true
}) => {
  const router = useRouter()
  const { 
    propertyId, 
    checkInDate, 
    checkOutDate,
    setCheckInDate,
    setCheckOutDate
  } = useBookingStore()
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const handleReserve = () => {
    if (onReserve) {
      onReserve()
    } else if (propertyId) {
      router.push(`/booking/${propertyId}`)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return null
    try {
      return format(date, "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return null
    }
  }

  const hasSelectedDates = checkInDate && checkOutDate
  const checkInFormatted = formatDate(checkInDate)
  const checkOutFormatted = formatDate(checkOutDate)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 md:hidden">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <div className="flex items-center">
              {originalPrice && <span className="text-gray-500 line-through text-sm mr-2">{originalPrice}</span>}
              <span className="text-black font-bold text-xl">{discountedPrice}</span>
              <span className="text-sm text-gray-600 ml-1">night</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-gray-600">Free cancellation</span>
            </div>
          </div>
          
          <Button 
            className="bg-primary text-white font-medium py-2 px-6 rounded-md"
            onClick={handleReserve}
            disabled={!propertyAvailable || !hasSelectedDates}
          >
            {hasSelectedDates ? "Reserve" : "Select dates"}
          </Button>
        </div>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md"
          onClick={() => setIsDatePickerOpen(true)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {hasSelectedDates 
            ? <span>{checkInFormatted} - {checkOutFormatted}</span>
            : <span>Select dates</span>
          }
        </Button>
      </div>

      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent className="max-w-3xl sm:max-w-md md:max-w-3xl">
          <DateRangePicker
            initialStartDate={checkInDate}
            initialEndDate={checkOutDate}
            onStartDateChange={setCheckInDate}
            onEndDateChange={setCheckOutDate}
            minDate={new Date()}
            disabled={!propertyAvailable}
            onApply={() => setIsDatePickerOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PropertyFooter