"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/prisma/db"
import { getAuthenticatedUser } from "@/config/useAuth"

export async function getProperty(slug: string) {
    try {
      const property = await db.property.findUnique({
        where: { slug },
        include: {
          host: {
            select: {
              id: true,
              name: true,
              image: true,
              createdAt: true,
            },
          },
          category: true,
          address: true,
          pricing: true,
          bookingSettings: true,
        },
      })
  
      if (!property) {
        return null
      }
  
      // Calculate the host's years of hosting
      const yearsHosting = property.host.createdAt
        ? Math.floor((new Date().getTime() - new Date(property.host.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : 0
  
      // Format the property data and convert Decimal to number
      return {
        ...property,
        // Convert Decimal to number
        bathrooms: property.bathrooms ? Number(property.bathrooms) : null,
        avgRating: property.avgRating ? Number(property.avgRating) : null,
        // Convert any Decimal in pricing
        pricing: property.pricing ? {
          ...property.pricing,
          basePrice: Number(property.pricing.basePrice),
          cleaningFee: property.pricing.cleaningFee ? Number(property.pricing.cleaningFee) : null,
          serviceFee: property.pricing.serviceFee ? Number(property.pricing.serviceFee) : null,
          taxRate: property.pricing.taxRate ? Number(property.pricing.taxRate) : null,
          weeklyDiscount: property.pricing.weeklyDiscount ? Number(property.pricing.weeklyDiscount) : null,
          monthlyDiscount: property.pricing.monthlyDiscount ? Number(property.pricing.monthlyDiscount) : null,
        } : null,
        // Convert any Decimal in address
        address: property.address ? {
          ...property.address,
          latitude: property.address.latitude ? Number(property.address.latitude) : null,
          longitude: property.address.longitude ? Number(property.address.longitude) : null,
        } : null,
        host: {
          ...property.host,
          yearsHosting,
        },
        createdAt: property.createdAt.toISOString(),
        updatedAt: property.updatedAt.toISOString(),
      }
    } catch (error) {
      console.error("Error fetching property:", error)
      return null
    }
  }

export async function getPropertyRooms(propertyId: string) {
  try {
    const rooms = await db.room.findMany({
      where: { propertyId },
      orderBy: { createdAt: "asc" },
    })

    return rooms.map((room) => ({
      ...room,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching property rooms:", error)
    return []
  }
}

// Get property reviews
export async function getPropertyReviews(propertyId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        propertyId,
        isPublished: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return reviews.map((review) => ({
      ...review,
      author: {
        ...review.author,
        yearsOnPlatform: review.author.createdAt
          ? Math.floor(
              (new Date().getTime() - new Date(review.author.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365),
            )
          : 0,
      },
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching property reviews:", error)
    return []
  }
}

// Create a new review
export async function createReview(data: {
  propertyId: string
  rating: number
  comment: string
  cleanliness?: number
  accuracy?: number
  communication?: number
  location?: number
  checkIn?: number
  value?: number
}) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if user has already reviewed this property
    const existingReview = await db.review.findFirst({
      where: {
        propertyId: data.propertyId,
        authorId: user.id,
      },
    })

    if (existingReview) {
      return { success: false, error: "You have already reviewed this property" }
    }

    // Create the review
    const review = await db.review.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        authorId: user.id,
        propertyId: data.propertyId,
        cleanliness: data.cleanliness,
        accuracy: data.accuracy,
        communication: data.communication,
        location: data.location,
        checkIn: data.checkIn,
        value: data.value,
        isPublished: true,
      },
    })

    // Update property average rating and review count
    const allReviews = await db.review.findMany({
      where: {
        propertyId: data.propertyId,
        isPublished: true,
      },
      select: {
        rating: true,
      },
    })

    const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

    await db.property.update({
      where: { id: data.propertyId },
      data: {
        avgRating: avgRating,
        reviewCount: allReviews.length,
      },
    })

    revalidatePath(`/property/${data.propertyId}`)

    return { success: true, data: review }
  } catch (error) {
    console.error("Error creating review:", error)
    return { success: false, error: "Failed to create review" }
  }
}

export async function checkPropertyAvailability(propertyId: string, checkInDate: string, checkOutDate: string) {
    try {
      const property = await db.property.findUnique({
        where: { id: propertyId },
        select: { isAvailable: true },
      })
  
      if (!property || !property.isAvailable) {
        return { available: false, reason: "Property is not available for booking" }
      }
  
   
      let checkInDateObj: Date;
      let checkOutDateObj: Date;
      
      try {
        checkInDateObj = new Date(checkInDate);
        checkOutDateObj = new Date(checkOutDate);
        
        if (isNaN(checkInDateObj.getTime()) || isNaN(checkOutDateObj.getTime())) {
          console.error("Invalid date format:", { checkInDate, checkOutDate });
          return { available: false, reason: "Invalid date format" };
        }
      } catch (error) {
        console.error("Error parsing dates:", error, { checkInDate, checkOutDate });
        return { available: false, reason: "Invalid date format" };
      }
  
      const overlappingBookings = await db.booking.findMany({
        where: {
          propertyId,
          status: { in: ["CONFIRMED", "PENDING"] },
          OR: [
            {
              AND: [
                { checkInDate: { lte: checkInDateObj } }, 
                { checkOutDate: { gt: checkInDateObj } }
              ],
            },
            {
              AND: [
                { checkInDate: { lt: checkOutDateObj } }, 
                { checkOutDate: { gte: checkOutDateObj } }
              ],
            },
            {
              AND: [
                { checkInDate: { gte: checkInDateObj } }, 
                { checkOutDate: { lte: checkOutDateObj } }
              ],
            },
          ],
        },
      })
  
      if (overlappingBookings.length > 0) {
        return { available: false, reason: "Selected dates are not available" }
      }
  
      return { available: true }
    } catch (error) {
      console.error("Error checking property availability:", error)
      return { available: false, reason: "Error checking availability" }
    }
  }
