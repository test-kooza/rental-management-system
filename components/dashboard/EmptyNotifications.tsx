import { Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyNotifications() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No notifications yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          When you receive notifications about your bookings, messages, or account updates, they'll appear here.
        </p>
      </CardContent>
    </Card>
  )
}

