import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BookingStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-5 w-24 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-muted"></div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

