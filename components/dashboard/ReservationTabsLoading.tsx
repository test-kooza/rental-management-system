import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function ReservationTabsLoading() {
  return (
    <div className="space-y-4">
      <div className="flex w-full justify-between rounded-lg border p-1">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-9 flex-1 mx-0.5 rounded-md" />
          ))}
      </div>

      <Card className="p-6">
        <Skeleton className="h-8 w-[250px] mb-6" />
        <div className="space-y-2">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
      </Card>
    </div>
  )
}

