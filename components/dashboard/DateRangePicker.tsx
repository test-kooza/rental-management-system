"use client"

import { useState, useEffect } from "react"
import { format, addMonths, isSameDay, isWithinInterval, startOfDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

type DateRangePickerProps = {
  initialStartDate?: Date | null
  initialEndDate?: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  disabled?: boolean
  onApply?: () => void
}

export default function DateRangePicker({
  initialStartDate,
  initialEndDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  className,
  disabled = false,
  onApply,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null)
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [focusedInput, setFocusedInput] = useState<"startDate" | "endDate" | null>(null)
  const [isDatesCleared, setIsDatesCleared] = useState<boolean>(false)

  // Update internal state when props change
  useEffect(() => {
    if (initialStartDate !== undefined) {
      setStartDate(initialStartDate)
    }
    if (initialEndDate !== undefined) {
      setEndDate(initialEndDate)
    }
  }, [initialStartDate, initialEndDate])

  // Reset dates cleared flag when either date changes externally
  useEffect(() => {
    if (initialStartDate || initialEndDate) {
      setIsDatesCleared(false)
    }
  }, [initialStartDate, initialEndDate])

  const handleDateSelect = (date: Date | undefined) => {
    // Convert undefined to null for consistency
    const selectedDate = date || null

    if (disabled) return

    // If dates were cleared, reset the flag and start fresh
    if (isDatesCleared) {
      setIsDatesCleared(false)
      setStartDate(selectedDate)
      onStartDateChange(selectedDate)
      setFocusedInput("endDate")
      return
    }

    if (!focusedInput) {
      // If no input is focused, default to start date
      setFocusedInput("startDate")
      setStartDate(selectedDate)
      onStartDateChange(selectedDate)
      return
    }

    if (focusedInput === "startDate") {
      setStartDate(selectedDate)
      onStartDateChange(selectedDate)
      setFocusedInput("endDate")
    } else {
      // Ensure end date is not before start date
      if (startDate && selectedDate && selectedDate < startDate) {
        setEndDate(null)
        onEndDateChange(null)
        setStartDate(selectedDate)
        onStartDateChange(selectedDate)
        setFocusedInput("endDate")
      } else {
        setEndDate(selectedDate)
        onEndDateChange(selectedDate)
        setFocusedInput(null)
      }
    }
  }

  const handleMouseEnter = (day: Date) => {
    if (focusedInput === "endDate" && startDate) {
      setHoverDate(day)
    }
  }

  const handleMouseLeave = () => {
    setHoverDate(null)
  }

  // Fixed type issues by ensuring these functions always return boolean
  const isDateInRange = (day: Date): boolean => {
    if (!startDate) return false

    if (endDate) {
      return isWithinInterval(day, {
        start: startOfDay(startDate),
        end: startOfDay(endDate),
      })
    }

    if (hoverDate && focusedInput === "endDate") {
      return isWithinInterval(day, {
        start: startOfDay(startDate),
        end: startOfDay(hoverDate),
      })
    }

    return false
  }

  const isStartDate = (day: Date): boolean => {
    return startDate ? isSameDay(day, startDate) : false
  }

  const isEndDate = (day: Date): boolean => {
    return endDate ? isSameDay(day, endDate) : false
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1))
  }

  const clearDates = () => {
    setStartDate(null)
    setEndDate(null)
    onStartDateChange(null)
    onEndDateChange(null)
    setFocusedInput("startDate")
    setIsDatesCleared(true)
  }

  const handleApply = () => {
    setFocusedInput(null)
    if (onApply) {
      onApply()
   
    }
    toast.success("Dates Set")
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">
          {startDate && endDate
            ? `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`
            : startDate
              ? `${format(startDate, "MMM d, yyyy")} - Select end date`
              : "Select dates"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            className="h-8 w-8 rounded-full"
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 rounded-full"
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-center mb-2">
            <h3 className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
          </div>
          <Calendar
            mode="single"
            selected={focusedInput === "startDate" ? startDate || undefined : endDate || undefined}
            onSelect={handleDateSelect}
            month={currentMonth}
            onDayMouseEnter={handleMouseEnter}
            onDayMouseLeave={handleMouseLeave}
            disabled={disabled || (minDate ? { before: minDate } : undefined)}
            modifiers={{
              range: isDateInRange,
              rangeStart: isStartDate,
              rangeEnd: isEndDate,
            }}
            modifiersClassNames={{
              range: "bg-primary/10",
              rangeStart: "bg-primary text-primary-foreground rounded-l-md",
              rangeEnd: "bg-primary text-primary-foreground rounded-r-md",
            }}
            className="rounded-md border"
          />
        </div>
        <div>
          <div className="text-center mb-2">
            <h3 className="text-sm font-medium">{format(addMonths(currentMonth, 1), "MMMM yyyy")}</h3>
          </div>
          <Calendar
            mode="single"
            selected={focusedInput === "startDate" ? startDate || undefined : endDate || undefined}
            onSelect={handleDateSelect}
            month={addMonths(currentMonth, 1)}
            onDayMouseEnter={handleMouseEnter}
            onDayMouseLeave={handleMouseLeave}
            disabled={disabled || (minDate ? { before: minDate } : undefined)}
            modifiers={{
              range: isDateInRange,
              rangeStart: isStartDate,
              rangeEnd: isEndDate,
            }}
            modifiersClassNames={{
              range: "bg-primary/10",
              rangeStart: "bg-primary text-primary-foreground rounded-l-md",
              rangeEnd: "bg-primary text-primary-foreground rounded-r-md",
            }}
            className="rounded-md border"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        {(startDate || endDate) ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDates}
            disabled={disabled || (!startDate && !endDate)}
            className="text-sm flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear dates
          </Button>
        ) : (
          <div></div> // Empty placeholder for flex spacing
        )}
        <Button
          variant="default"
          size="sm"
          onClick={handleApply}
          disabled={disabled || !startDate || !endDate}
          className="text-sm"
        >
          Apply
        </Button>
      </div>
    </div>
  )
}