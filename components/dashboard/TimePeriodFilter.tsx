"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePeriodFilterProps {
  onPeriodChange: (period: string) => void
  defaultPeriod?: string
  showExport?: boolean
}

export function TimePeriodFilter({ onPeriodChange, defaultPeriod = "week", showExport = true }: TimePeriodFilterProps) {
  const [period, setPeriod] = useState(defaultPeriod)

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    onPeriodChange(value)
  }

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">Last 7 days</SelectItem>
          <SelectItem value="month">Last 30 days</SelectItem>
          <SelectItem value="year">Last 12 months</SelectItem>
        </SelectContent>
      </Select>

      {showExport && (
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      )}
    </div>
  )
}

