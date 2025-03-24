import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  heading: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ heading, description, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 pb-5 md:flex-row md:items-center md:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

