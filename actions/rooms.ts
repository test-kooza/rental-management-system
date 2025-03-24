"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/prisma/db"
import { getAuthenticatedUser } from "@/config/useAuth"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"
import { RoomTableData } from "@/app/(dashboard)/dashboard/rooms/columns"

// Types
export type RoomProps = {
  title: string
  description?: string
  propertyId: string
  roomType: string
  beds: number
  bedType?: string
  maxGuests: number
  images: string[]
  amenities?: string[]
  isPrivate: boolean
  hasEnsuite: boolean
  floorLevel?: number
}

export type PropertyBasic = {
  id: string
  title: string
}

// Create a new room
export async function createRoom(data: RoomProps) {
  try {
    // Verify the property belongs to the authenticated user
    const user = await getAuthenticatedUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const property = await db.property.findUnique({
      where: {
        id: data.propertyId,
        hostId: user.id,
      },
    })

    if (!property) {
      return { success: false, error: "Property not found or you don't have permission" }
    }

    // Create the room
    const room = await db.room.create({
      data: {
        title: data.title,
        description: data.description,
        propertyId: data.propertyId,
        roomType: data.roomType,
        beds: data.beds,
        bedType: data.bedType,
        maxGuests: data.maxGuests,
        images: data.images,
        amenities: data.amenities || [],
        isPrivate: data.isPrivate,
        hasEnsuite: data.hasEnsuite,
        floorLevel: data.floorLevel,
      },
    })

    revalidatePath("/dashboard/rooms")
    revalidatePath(`/dashboard/properties/${data.propertyId}`)

    return { success: true, data: room }
  } catch (error) {
    console.error("Error creating room:", error)
    return { success: false, error: "Failed to create room" }
  }
}

// Update an existing room
export async function updateRoom({ id, room }: { id: string; room: RoomProps }) {
  try {
    // Verify the room belongs to the authenticated user's property
    const user = await getAuthenticatedUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const existingRoom = await db.room.findUnique({
      where: { id },
      include: { property: true },
    })

    if (!existingRoom) {
      return { success: false, error: "Room not found" }
    }

    if (existingRoom.property.hostId !== user.id) {
      return { success: false, error: "You don't have permission to update this room" }
    }

    // Update the room
    const updatedRoom = await db.room.update({
      where: { id },
      data: {
        title: room.title,
        description: room.description,
        propertyId: room.propertyId,
        roomType: room.roomType,
        beds: room.beds,
        bedType: room.bedType,
        maxGuests: room.maxGuests,
        images: room.images,
        amenities: room.amenities || [],
        isPrivate: room.isPrivate,
        hasEnsuite: room.hasEnsuite,
        floorLevel: room.floorLevel,
      },
    })

    revalidatePath("/dashboard/rooms")
    revalidatePath(`/dashboard/properties/${room.propertyId}`)

    return { success: true, data: updatedRoom }
  } catch (error) {
    console.error("Error updating room:", error)
    return { success: false, error: "Failed to update room" }
  }
}

// Get properties for the logged-in user (basic info only)
export async function getUserProperties(): Promise<PropertyBasic[]> {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return []
    }

    const properties = await db.property.findMany({
      where: {
        hostId: user.id,
      },
      select: {
        id: true,
        title: true,
      },
    })

    return properties
  } catch (error) {
    console.error("Error fetching user properties:", error)
    return []
  }
}

// Delete a room
export async function deleteRoom(id: string) {
  try {
    // Verify the room belongs to the authenticated user's property
    const user = await getAuthenticatedUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const existingRoom = await db.room.findUnique({
      where: { id },
      include: { property: true },
    })

    if (!existingRoom) {
      return { success: false, error: "Room not found" }
    }

    if (existingRoom.property.hostId !== user.id) {
      return { success: false, error: "You don't have permission to delete this room" }
    }

    // Delete the room
    await db.room.delete({
      where: { id },
    })

    revalidatePath("/dashboard/rooms")
    revalidatePath(`/dashboard/properties/${existingRoom.propertyId}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting room:", error)
    return { success: false, error: "Failed to delete room" }
  }
}



export async function getUserRooms(): Promise<RoomTableData[]> {
    try {
        const session = await getServerSession(authOptions);
        const user=session?.user      
      if (!user) {
        return []
      }
      
      const rooms = await db.room.findMany({
        where: {
          property: {
            hostId: user.id
          }
        },
        include: {
          property: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      })
      
      return rooms.map(room => ({
        id: room.id,
        title: room.title,
        roomType: room.roomType,
        propertyTitle: room.property.title,
        propertyId: room.propertyId,
        beds: room.beds,
        maxGuests: room.maxGuests,
        isPrivate: room.isPrivate,
        hasEnsuite: room.hasEnsuite,
        images: room.images,
        createdAt: room.createdAt.toISOString()
      }))
    } catch (error) {
      console.error("Error fetching user rooms:", error)
      return []
    }
  }

  export async function getRoomById(id: string) {
    try {
  const session = await getServerSession(authOptions);
  const user=session?.user
      if (!user) {
        return null
      }
  
      const room = await db.room.findUnique({
        where: { id },
        include: {
          property: {
            select: {
              title: true,
              hostId: true,
            },
          },
        },
      })
  
      // Verify the room belongs to the user
      if (!room || room.property.hostId !== user.id) {
        return null
      }
  
      return {
        ...room,
        propertyTitle: room.property.title,
      }
    } catch (error) {
      console.error("Error fetching room:", error)
      return null
    }
  }