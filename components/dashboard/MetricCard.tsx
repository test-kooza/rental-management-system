import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowUp, ArrowDown, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value:any
  icon: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    label?: string
  }
  loading?: boolean
  className?: string
}

export function MetricCard({ title, value, icon: Icon, trend, loading = false, className }: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        {trend ? (
          <div
            className={cn(
              "flex items-center text-sm",
              trend.direction === "up"
                ? "text-green-600"
                : trend.direction === "down"
                  ? "text-red-600"
                  : "text-muted-foreground",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUp className="mr-1 h-4 w-4" />
            ) : trend.direction === "down" ? (
              <ArrowDown className="mr-1 h-4 w-4" />
            ) : null}
            {trend.value}
            {trend.label && <span className="ml-1">{trend.label}</span>}
          </div>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </CardContent>
      <div className="absolute right-0 bottom-0 opacity-5">
        <Icon className="h-24 w-24 text-primary" />
      </div>
    </Card>
  )
}

