"use server"

import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

export type PropertyCategoryProps = {
  name: string
  description: string
  icon: string | null
  slug: string
  isActive: boolean
  createdById: string
}

export type UpdatePropertyCategoryProps = {
  id: string
  name: string
  description: string
  icon: string | null
  slug: string
  isActive: boolean
}
export type PropertyCategoryBasic = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  isActive: boolean;
};

export async function getAllPropertyCategories(): Promise<PropertyCategoryBasic[]> {
  try {
    const categories = await db.propertyCategory.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    return categories;
  } catch (error) {
    console.error("Error fetching property categories:", error);
    return [];
  }
}
export async function getPropertyCategories() {
  try {
    const categories = await db.propertyCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return categories
  } catch (error) {
    console.error("Failed to fetch property categories:", error)
    return null
  }
}

export async function getPropertyCategoryById(id: string) {
  try {
    const category = await db.propertyCategory.findUnique({
      where: {
        id,
      },
    })
    return category
  } catch (error) {
    console.error(`Failed to fetch property category with ID ${id}:`, error)
    return null
  }
}

export async function createCategory(data: PropertyCategoryProps) {
  const { slug } = data
  try {
    // Check if category with this slug already exists
    const existingCategory = await db.propertyCategory.findUnique({
      where: {
        slug,
      },
    })

    if (existingCategory) {
      throw new Error("A category with this name already exists")
    }

    const newCategory = await db.propertyCategory.create({
      data,
    })

    revalidatePath("/dashboard/property-category")
    return newCategory
  } catch (error) {
    console.error("Failed to create property category:", error)
    throw error
  }
}

export async function updateCategory(data: UpdatePropertyCategoryProps) {
  const { id, ...updateData } = data
  try {
    // Check if another category with this slug already exists (excluding current one)
    const existingCategory = await db.propertyCategory.findFirst({
      where: {
        slug: updateData.slug,
        id: {
          not: id,
        },
      },
    })

    if (existingCategory) {
      throw new Error("Another category with this name already exists")
    }

    const updatedCategory = await db.propertyCategory.update({
      where: {
        id,
      },
      data: updateData,
    })

    revalidatePath("/dashboard/property-categories")
    revalidatePath(`/dashboard/property-categories/edit/${id}`)
    return updatedCategory
  } catch (error) {
    console.error(`Failed to update property category with ID ${id}:`, error)
    throw error
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.propertyCategory.delete({
      where: {
        id,
      },
    })

    revalidatePath("/dashboard/property-categories")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete property category with ID ${id}:`, error)
    return { success: false, error }
  }
}

