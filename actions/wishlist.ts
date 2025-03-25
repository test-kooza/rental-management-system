"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/prisma/db"
import { getAuthenticatedUser2 } from "@/config/useAuth"
import { redirect } from "next/navigation"

const safeDecimal = (value: any) => {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export async function addToWishlist(propertyId: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required", requiresAuth: true }
    }

    const property = await db.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      return { success: false, error: "Property not found" }
    }

    let wishlist = await db.wishlist.findUnique({
      where: { userId: user.id }
    })

    if (!wishlist) {
      wishlist = await db.wishlist.create({
        data: {
          userId: user.id,
          properties: [propertyId]
        }
      })
    } else {
      if (!wishlist.properties.includes(propertyId)) {
        wishlist = await db.wishlist.update({
          where: { userId: user.id },
          data: {
            properties: [...wishlist.properties, propertyId]
          }
        })
      }
    }

    revalidatePath("/wishlist")
    revalidatePath("/")

    return { success: true, data: wishlist }
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return { success: false, error: "Login First" }
  }
}

export async function removeFromWishlist(propertyId: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required", requiresAuth: true }
    }

    const wishlist = await db.wishlist.findUnique({
      where: { userId: user.id }
    })

    if (!wishlist) {
      return { success: false, error: "Wishlist not found" }
    }

    // Remove property from wishlist
    const updatedWishlist = await db.wishlist.update({
      where: { userId: user.id },
      data: {
        properties: wishlist.properties.filter(id => id !== propertyId)
      }
    })

    revalidatePath("/wishlist")
    revalidatePath("/")

    return { success: true, data: updatedWishlist }
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, error: "Failed to remove property from wishlist" }
  }
}

export async function getWishlistProperties() {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required", requiresAuth: true }
    }

    // Get user's wishlist
    const wishlist = await db.wishlist.findUnique({
      where: { userId: user.id }
    })

    if (!wishlist || wishlist.properties.length === 0) {
      return { success: true, data: [] }
    }

    const propertiesRaw = await db.property.findMany({
      where: {
        id: {
          in: wishlist.properties
        }
      },
      select: {
        id: true,
        title: true,
        images: true,
        slug: true,
        isFeatured: true,
        avgRating: true,
        isAvailable:true,
        host: {
          select: {
            id: true,
            name: true
          }
        },
        address: {
          select: {
            city: true,
            country: true
          }
        },
        pricing: {
          select: {
            basePrice: true,
            currency: true
          }
        }
      }
    })
    
    // Transform properties to handle Decimal and null values safely
    const properties = propertiesRaw.map(property => ({
      ...property,
      avgRating: property.avgRating ? safeDecimal(property.avgRating) : 0,
      pricing: property.pricing ? {
        ...property.pricing,
        basePrice: safeDecimal(property.pricing.basePrice)
      } : { basePrice: 0, currency: 'USD' }
    }))
      
    return { success: true, data: properties }
  } catch (error) {
    console.error("Error fetching wishlist properties:", error)
    return { success: false, error: "Failed to fetch wishlist properties" }
  }
}

// Check if a property is in the user's wishlist
export async function isPropertyInWishlist(propertyId: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, isInWishlist: false, requiresAuth: true }
    }

    // Get user's wishlist
    const wishlist = await db.wishlist.findUnique({
      where: { userId: user.id }
    })

    if (!wishlist) {
      return { success: true, isInWishlist: false }
    }

    return { 
      success: true, 
      isInWishlist: wishlist.properties.includes(propertyId) 
    }
  } catch (error) {
    console.error("Error checking wishlist status:", error)
    return { success: false, isInWishlist: false, error: "Failed to check wishlist status" }
  }
}