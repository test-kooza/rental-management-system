"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { markAllNotificationsAsRead } from "@/actions/notifications"


interface HeaderActionsProps {
  hasUnread: boolean
}

export function HeaderActions({ hasUnread }: HeaderActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAllAsRead = async () => {
    if (!hasUnread || isLoading) return

    setIsLoading(true)
    try {
      const result = await markAllNotificationsAsRead()

      if (result.success) {
        toast.success("All notifications marked as read")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error("Failed to mark all notifications as read")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleMarkAllAsRead}
      disabled={!hasUnread || isLoading}
    >
      <Bell className="h-4 w-4" />
      <span>Mark all as read</span>
    </Button>
  )
}

