"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, Calendar, Check, MessageSquare, Star, CreditCard, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Notification } from "@/types/types"
import { markNotificationAsRead } from "@/actions/notifications"
import { NotificationType } from "@prisma/client"
import Link from "next/link"

interface NotificationCardProps {
  notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const [isRead, setIsRead] = useState(notification.isRead)
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsRead = async () => {
    if (isRead) return

    setIsLoading(true)
    try {
      await markNotificationAsRead(notification.id)
      setIsRead(true)
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.BOOKING_REQUEST:
      case NotificationType.BOOKING_CONFIRMED:
      case NotificationType.BOOKING_CANCELLED:
        return <Calendar className="h-5 w-5" />
      case NotificationType.MESSAGE_RECEIVED:
        return <MessageSquare className="h-5 w-5" />
      case NotificationType.REVIEW_RECEIVED:
        return <Star className="h-5 w-5" />
      case NotificationType.PAYOUT_SENT:
      case NotificationType.PAYMENT_PROCESSED:
        return <CreditCard className="h-5 w-5" />
      case NotificationType.SYSTEM_UPDATE:
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (notification.type) {
      case NotificationType.BOOKING_REQUEST:
        return "Booking Request"
      case NotificationType.BOOKING_CONFIRMED:
        return "Booking Confirmed"
      case NotificationType.BOOKING_CANCELLED:
        return "Booking Cancelled"
      case NotificationType.MESSAGE_RECEIVED:
        return "New Message"
      case NotificationType.REVIEW_RECEIVED:
        return "New Review"
      case NotificationType.PAYOUT_SENT:
        return "Payout Sent"
      case NotificationType.PAYMENT_PROCESSED:
        return "Payment Processed"
      case NotificationType.SYSTEM_UPDATE:
        return "System Update"
      default:
        return "Notification"
    }
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", !isRead && "border-l-4 border-l-primary")}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
              !isRead ? "bg-primary text-primary-foreground" : "bg-muted",
            )}
          >
            {getIcon()}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-normal">
                {getTypeLabel()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>

            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-muted-foreground">{notification.message}</p>

            {notification.bookingId && (
              <Button variant="link" className="h-auto p-0 text-primary" asChild>
                <Link href={`/dashboard/bookings`}>View booking details</Link>
              </Button>
            )}
          </div>

          {!isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleMarkAsRead}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

