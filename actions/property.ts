"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { PropertyStyle, SystemRole } from "@prisma/client";
import { generateSlug } from "@/lib/generateSlug";
import { Decimal } from "@prisma/client/runtime/library";

export type PropertyFormData = {
  title: string;
  description: string;
  shortDescription?: string;
  propertyStyle: PropertyStyle[];
  categoryId: string;
  hostId: string;
  images: string[];
  amenities: {
    hasWifi: boolean;
    hasAC: boolean;
    hasParking: boolean;
    hasKitchen: boolean;
    hasPool: boolean;
    hasGym: boolean;
    hasTv: boolean;
    isBeachfront: boolean;
    isMountainView: boolean;
    isPetFriendly: boolean;
    [key: string]: boolean;
  };
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
    neighborhood?: string;
    isExactLocation: boolean;
  };
  pricing: {
    basePrice: number;
    cleaningFee?: number;
    serviceFee?: number;
    taxRate?: number;
    weeklyDiscount?: number;
    monthlyDiscount?: number;
    currency: string;
  };
  bookingSettings?: {
    instantBooking: boolean;
    minStay: number;
    maxStay?: number;
    checkInTime: string;
    checkOutTime: string;
    allowChildren: boolean;
    allowInfants: boolean;
    allowPets: boolean;
    allowSmoking: boolean;
    allowParties: boolean;
    cancellationPolicy: string;
    advanceBookingWindow: number;
  };
  isPublished?: boolean;
  isFeatured?: boolean;
};
export type PropertyDetails = {
  id: string
  title: string
  description: string
  images: string[]
  avgRating: number | null
  reviewCount: number
  propertyType: string
  hostId: string
  hostName: string
  hostImage: string | null
}

export async function createProperty(data: PropertyFormData) {
  try {
    const slug = generateSlug(data.title);
    
    // Check if property with this slug already exists
    const existingProperty = await db.property.findUnique({
      where: { slug },
    });

    if (existingProperty) {
      throw new Error("A property with this title already exists");
    }

    // Create property with nested creates for address and pricing
    const newProperty = await db.property.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        propertyStyle: data.propertyStyle,
        categoryId: data.categoryId,
        hostId: data.hostId,
        images: data.images,
        amenities: data.amenities,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        beds: data.beds,
        bathrooms: parseFloat(data.bathrooms.toString()),
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        address: {
          create: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state || null,
            postalCode: data.address.postalCode || null,
            country: data.address.country,
            latitude: data.address.latitude ? parseFloat(data.address.latitude.toString()) : null,
            longitude: data.address.longitude ? parseFloat(data.address.longitude.toString()) : null,
            formattedAddress: data.address.formattedAddress || null,
            neighborhood: data.address.neighborhood || null,
            isExactLocation: data.address.isExactLocation,
          },
        },
        pricing: {
          create: {
            basePrice: parseFloat(data.pricing.basePrice.toString()),
            cleaningFee: data.pricing.cleaningFee ? parseFloat(data.pricing.cleaningFee.toString()) : null,
            serviceFee: data.pricing.serviceFee ? parseFloat(data.pricing.serviceFee.toString()) : null,
            taxRate: data.pricing.taxRate ? parseFloat(data.pricing.taxRate.toString()) : null,
            weeklyDiscount: data.pricing.weeklyDiscount ? parseFloat(data.pricing.weeklyDiscount.toString()) : null,
            monthlyDiscount: data.pricing.monthlyDiscount ? parseFloat(data.pricing.monthlyDiscount.toString()) : null,
            currency: data.pricing.currency,
          },
        },
        bookingSettings: data.bookingSettings
          ? {
              create: {
                instantBooking: data.bookingSettings.instantBooking,
                minStay: data.bookingSettings.minStay,
                maxStay: data.bookingSettings.maxStay || null,
                checkInTime: data.bookingSettings.checkInTime,
                checkOutTime: data.bookingSettings.checkOutTime,
                allowChildren: data.bookingSettings.allowChildren,
                allowInfants: data.bookingSettings.allowInfants,
                allowPets: data.bookingSettings.allowPets,
                allowSmoking: data.bookingSettings.allowSmoking,
                allowParties: data.bookingSettings.allowParties,
                cancellationPolicy: data.bookingSettings.cancellationPolicy,
                advanceBookingWindow: data.bookingSettings.advanceBookingWindow,
              },
            }
          : undefined,
      },
    });

    revalidatePath("/dashboard/properties");
    return { success: true, property: newProperty };
  } catch (error) {
    console.error("Failed to create property:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateProperty(id: string, data: PropertyFormData) {
  try {
    // Fetch existing property to get current slug
    const existingProperty = await db.property.findUnique({
      where: { id },
      include: { address: true, pricing: true, bookingSettings: true },
    });

    if (!existingProperty) {
      throw new Error("Property not found");
    }

    // Only generate new slug if title has changed
    const slug = existingProperty.title !== data.title ? generateSlug(data.title) : existingProperty.slug;

    // Check for slug conflict only if slug has changed
    if (slug !== existingProperty.slug) {
      const slugConflict = await db.property.findUnique({
        where: { slug },
      });

      if (slugConflict && slugConflict.id !== id) {
        throw new Error("A property with this title already exists");
      }
    }

    // Update property with nested updates for address and pricing
    const updatedProperty = await db.property.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        propertyStyle: data.propertyStyle,
        categoryId: data.categoryId,
        images: data.images,
        amenities: data.amenities,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        beds: data.beds,
        bathrooms: parseFloat(data.bathrooms.toString()),
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        address: {
          update: {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state || null,
            postalCode: data.address.postalCode || null,
            country: data.address.country,
            latitude: data.address.latitude ? parseFloat(data.address.latitude.toString()) : null,
            longitude: data.address.longitude ? parseFloat(data.address.longitude.toString()) : null,
            formattedAddress: data.address.formattedAddress || null,
            neighborhood: data.address.neighborhood || null,
            isExactLocation: data.address.isExactLocation,
          },
        },
        pricing: {
          update: {
            basePrice: parseFloat(data.pricing.basePrice.toString()),
            cleaningFee: data.pricing.cleaningFee ? parseFloat(data.pricing.cleaningFee.toString()) : null,
            serviceFee: data.pricing.serviceFee ? parseFloat(data.pricing.serviceFee.toString()) : null,
            taxRate: data.pricing.taxRate ? parseFloat(data.pricing.taxRate.toString()) : null,
            weeklyDiscount: data.pricing.weeklyDiscount ? parseFloat(data.pricing.weeklyDiscount.toString()) : null,
            monthlyDiscount: data.pricing.monthlyDiscount ? parseFloat(data.pricing.monthlyDiscount.toString()) : null,
            currency: data.pricing.currency,
          },
        },
        bookingSettings: existingProperty.bookingSettings
          ? {
              update: {
                instantBooking: data.bookingSettings?.instantBooking ?? true,
                minStay: data.bookingSettings?.minStay ?? 1,
                maxStay: data.bookingSettings?.maxStay || null,
                checkInTime: data.bookingSettings?.checkInTime ?? "15:00",
                checkOutTime: data.bookingSettings?.checkOutTime ?? "11:00",
                allowChildren: data.bookingSettings?.allowChildren ?? true,
                allowInfants: data.bookingSettings?.allowInfants ?? true,
                allowPets: data.bookingSettings?.allowPets ?? false,
                allowSmoking: data.bookingSettings?.allowSmoking ?? false,
                allowParties: data.bookingSettings?.allowParties ?? false,
                cancellationPolicy: data.bookingSettings?.cancellationPolicy ?? "MODERATE",
                advanceBookingWindow: data.bookingSettings?.advanceBookingWindow ?? 365,
              },
            }
          : data.bookingSettings
          ? {
              create: {
                instantBooking: data.bookingSettings.instantBooking,
                minStay: data.bookingSettings.minStay,
                maxStay: data.bookingSettings.maxStay || null,
                checkInTime: data.bookingSettings.checkInTime,
                checkOutTime: data.bookingSettings.checkOutTime,
                allowChildren: data.bookingSettings.allowChildren,
                allowInfants: data.bookingSettings.allowInfants,
                allowPets: data.bookingSettings.allowPets,
                allowSmoking: data.bookingSettings.allowSmoking,
                allowParties: data.bookingSettings.allowParties,
                cancellationPolicy: data.bookingSettings.cancellationPolicy,
                advanceBookingWindow: data.bookingSettings.advanceBookingWindow,
              },
            }
          : undefined,
      },
    });

    revalidatePath("/dashboard/properties");
    revalidatePath(`/dashboard/properties/${id}`);
    return { success: true, property: updatedProperty };
  } catch (error) {
    console.error("Failed to update property:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteProperty(id: string) {
  try {
    await db.property.delete({
      where: { id },
    });

    revalidatePath("/dashboard/properties");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete property:", error);
    return { success: false, error: (error as Error).message };
  }
}
export async function getProperties(userId: string, userRole: SystemRole) {
    try {
  
      const properties = await db.property.findMany({
        where: userRole === SystemRole.ADMIN ? {} : { hostId: userId },
        include: {
          category: true,
          host: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          address: true,
          pricing: true,
          bookingSettings: true,
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      
    
      return JSON.parse(JSON.stringify(properties));
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      return null;
    }
  }


  export async function getPropertyById(id: string) {
    const property = await db.property.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        pricing: true,
        bookingSettings: true,
      },
    })
  
    if (!property) {
      return null
    }
  
    return {
        ...property,
        bathrooms: property.bathrooms instanceof Decimal ? property.bathrooms.toNumber() : property.bathrooms,
        avgRating: property.avgRating instanceof Decimal ? property.avgRating.toNumber() : property.avgRating,
        viewCount: property.viewCount,
        address: property.address
          ? {
              ...property.address,
              latitude:
                property.address.latitude instanceof Decimal
                  ? property.address.latitude.toNumber()
                  : property.address.latitude,
              longitude:
                property.address.longitude instanceof Decimal
                  ? property.address.longitude.toNumber()
                  : property.address.longitude,
            }
          : null,
        pricing: property.pricing
          ? {
              ...property.pricing,
              basePrice:
                property.pricing.basePrice instanceof Decimal
                  ? property.pricing.basePrice.toNumber()
                  : property.pricing.basePrice,
              cleaningFee:
                property.pricing.cleaningFee instanceof Decimal
                  ? property.pricing.cleaningFee.toNumber()
                  : property.pricing.cleaningFee,
              serviceFee:
                property.pricing.serviceFee instanceof Decimal
                  ? property.pricing.serviceFee.toNumber()
                  : property.pricing.serviceFee,
              taxRate:
                property.pricing.taxRate instanceof Decimal
                  ? property.pricing.taxRate.toNumber()
                  : property.pricing.taxRate,
              weeklyDiscount:
                property.pricing.weeklyDiscount instanceof Decimal
                  ? property.pricing.weeklyDiscount.toNumber()
                  : property.pricing.weeklyDiscount,
              monthlyDiscount:
                property.pricing.monthlyDiscount instanceof Decimal
                  ? property.pricing.monthlyDiscount.toNumber()
                  : property.pricing.monthlyDiscount,
            }
          : null,
        bookingSettings: property.bookingSettings
          ? {
              ...property.bookingSettings,
              minStay: property.bookingSettings.minStay,
              maxStay: property.bookingSettings.maxStay,
              advanceBookingWindow: property.bookingSettings.advanceBookingWindow,
            }
          : null,
    }
  }
  
export async function getPropertiesByHostId(hostId: string) {
  try {
    const properties = await db.property.findMany({
      where: { hostId },
      include: {
        category: true,
        address: true,
        pricing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return properties;
  } catch (error) {
    console.error(`Failed to fetch properties for host ${hostId}:`, error);
    return null;
  }
}

export async function togglePropertyPublishStatus(id: string) {
  try {
    const property = await db.property.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: { isPublished: !property.isPublished },
    });

    revalidatePath("/dashboard/properties");
    return { success: true, property: updatedProperty };
  } catch (error) {
    console.error("Failed to toggle property publish status:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function togglePropertyFeatureStatus(id: string) {
  try {
    const property = await db.property.findUnique({
      where: { id },
      select: { isFeatured: true },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: { isFeatured: !property.isFeatured },
    });

    revalidatePath("/dashboard/properties");
    return { success: true, property: updatedProperty };
  } catch (error) {
    console.error("Failed to toggle property feature status:", error);
    return { success: false, error: (error as Error).message };
  }
}



export async function getPropertyDetails(propertyId: string | null): Promise<PropertyDetails | null> {
  try {
    if (!propertyId) return null
    
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    })
    
    if (!property) return null
    
    return {
      id: property.id,
      title: property.title,
      description: property.shortDescription || property.description,
      images: property.images,
      avgRating: property.avgRating ? parseFloat(property.avgRating.toString()) : null,
      reviewCount: property.reviewCount,
      propertyType: property.category.name,
      hostId: property.host.id,
      hostName: property.host.name,
      hostImage: property.host.image,
    }
  } catch (error) {
    console.error("Error fetching property details:", error)
    return null
  }
}
