import { getUserNotifications } from "@/actions/notifications"
import { EmptyNotifications } from "./EmptyNotifications"
import { NotificationCard } from "./NotificationCard"


interface NotificationListProps {
  userId: string
}

export async function NotificationList({ userId }: NotificationListProps) {
  const { notifications, error } = await getUserNotifications(userId)

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
        <p>Error loading notifications: {error}</p>
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return <EmptyNotifications />
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  )
}

