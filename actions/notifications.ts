"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/prisma/db"
import { getAuthenticatedUser } from "@/config/useAuth"

export async function getUserNotifications(userId: string) {
  try {
    const user = await getAuthenticatedUser()

    if (!user || user.id !== userId) {
      return {
        notifications: null,
        error: "Authentication required",
      }
    }

    const notifications = await db.notification.findMany({
      where: {
        OR: [{ hostId: userId }, { guestId: userId }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return {
      notifications,
      error: null,
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return {
      notifications: null,
      error: "Failed to fetch notifications",
    }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    // Verify the user is authenticated
    const user = await getAuthenticatedUser()

    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    const notification = await db.notification.findFirst({
      where: {
        id: notificationId,
        OR: [{ hostId: user.id }, { guestId: user.id }],
      },
    })

    if (!notification) {
      return {
        success: false,
        error: "Notification not found or you don't have permission",
      }
    }

    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath("/dashboard/notifications")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return {
      success: false,
      error: "Failed to mark notification as read",
    }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    await db.notification.updateMany({
      where: {
        OR: [{ hostId: user.id }, { guestId: user.id }],
        isRead: false,
      },
      data: { isRead: true },
    })

    revalidatePath("/dashboard/notifications")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    }
  }
}

