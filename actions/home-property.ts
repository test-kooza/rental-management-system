"use server"

import { db } from "@/prisma/db"
import { PropertyStyle } from "@prisma/client"

export type PropertyBasic = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  location: string;
  country: string;
  isAvailable:boolean;
  host: {
    id: string;
    name: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
  };
  avgRating: number;
  isFeatured: boolean;
  images: string[];
  categoryId: string;
  maxGuests: number;
  propertyStyle: PropertyStyle[];
  createdAt: Date;
};

export type PropertyQueryParams = {
  limit: number;
  offset: number;
  categoryId?: string;
  location?: string;
  maxPrice?: number;
  minPrice?: number;
  maxGuests?: number;
  propertyStyle?: PropertyStyle[];
};

export async function getProperties({
  limit = 8,
  offset = 0,
  categoryId,
  location,
  maxPrice,
  minPrice,
  maxGuests,
  propertyStyle,
}: PropertyQueryParams): Promise<{
  properties: PropertyBasic[];
  totalCount: number;
  hasMore: boolean;
}> {
  try {
    const whereConditions: any = {
      isPublished: true,
    };

    if (categoryId && categoryId !== 'all') {
      whereConditions.categoryId = categoryId;
    }

    if (location) {
      whereConditions.OR = [
        { title: { contains: location, mode: 'insensitive' } },
        { address: { city: { contains: location, mode: 'insensitive' } } },
        { address: { country: { contains: location, mode: 'insensitive' } } },
      ];
    }

    if (minPrice) {
      whereConditions.pricing = {
        ...whereConditions.pricing,
        basePrice: { gte: minPrice },
      };
    }

    if (maxPrice) {
      whereConditions.pricing = {
        ...whereConditions.pricing,
        basePrice: { lte: maxPrice },
      };
    }

    if (maxGuests) {
      whereConditions.maxGuests = { gte: maxGuests };
    }

    if (propertyStyle && propertyStyle.length > 0) {
      whereConditions.propertyStyle = {
        hasSome: propertyStyle,
      };
    }

    const totalCount = await db.property.count({
      where: whereConditions,
    });

    const properties = await db.property.findMany({
      where: whereConditions,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        images: true,
        avgRating: true,
        isFeatured: true,
        maxGuests: true,
        propertyStyle: true,
        categoryId: true,
        createdAt: true,
        isAvailable:true,
        pricing: {
          select: {
            basePrice: true,
            currency: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
          },
        },
        address: {
          select: {
            city: true,
            country: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    const transformedProperties: PropertyBasic[] = properties.map(property => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      isAvailable:property.isAvailable,
      shortDescription: property.shortDescription || '',
      location: property.address?.city || '',
      country: property.address?.country || '',
      host: {
        id: property.host.id,
        name: property.host.name,
      },
      pricing: {
        basePrice: property.pricing?.basePrice.toNumber() || 0,
        currency: property.pricing?.currency || 'USD',
      },
      avgRating: property.avgRating?.toNumber() || 0,
      isFeatured: property.isFeatured,
      images: property.images,
      categoryId: property.categoryId,
      maxGuests: property.maxGuests,
      propertyStyle: property.propertyStyle,
      createdAt: property.createdAt,
    }));

    return {
      properties: transformedProperties,
      totalCount,
      hasMore: offset + properties.length < totalCount,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      properties: [],
      totalCount: 0,
      hasMore: false,
    };
  }
}