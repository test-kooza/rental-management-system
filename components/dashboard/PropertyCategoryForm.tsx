"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"

import { generateSlug } from "@/lib/generateSlug"
import ImageUploader from "../FormInputs/ImageUploader"
import toast from "react-hot-toast"
import { createCategory, updateCategory } from "@/actions/property-category"
import type { PropertyCategory } from "@prisma/client"
import ImageInput from "../FormInputs/ImageInput"

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

type PropertyCategoryFormValues = z.infer<typeof formSchema>

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
}

interface PropertyCategoryFormProps {
  initialData?: PropertyCategory | null
  editingId?: string
  author: any
}

export default function PropertyCategoryForm({ initialData, editingId, author }: PropertyCategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [imageUrl, setImageUrl] = useState<string>(initialData?.icon || "/placeholder.jpg")
  const form = useForm<PropertyCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  })

  const onSubmit = async (values: PropertyCategoryFormValues) => {
    try {
      setIsLoading(true)
      const slug = generateSlug(values.name)
      const icon = imageUrl.length > 0 ? imageUrl : null

      if (editingId) {
        // Update existing category
        await updateCategory({
          id: editingId,
          name: values.name,
          description: values.description || "",
          icon,
          slug,
          isActive: values.isActive,
        })
        toast.success("Your category has been updated successfully.")
      } else {
        // Create new category
        await createCategory({
          name: values.name,
          description: values.description || "",
          icon,
          slug,
          isActive: values.isActive,
          createdById: author.id,
        })
        toast.success("Your new category has been created successfully.")
      }

      router.push("/dashboard/property-category")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to save the category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="md:space-y-8 space-y-4">
        <div className="flex items-center justify-between ">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{editingId ? "Edit Category" : "New Category"}</h2>
            <p className="text-muted-foreground text-sm">
              {editingId ? "Update the existing category" : "Create a new property category"}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/property-category")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Create"} Category
            </Button>
          </div>
        </div>

        <motion.div className="grid grid-cols-12 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Main content */}
          <motion.div className="lg:col-span-8 col-span-full space-y-6" variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>Category Information</CardTitle>
                <CardDescription>Create a new category or update an existing one</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {/* Name field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Apartments, Villas, Cabins" {...field} />
                        </FormControl>
                        <FormDescription>This will be displayed to users when browsing properties.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe this property category..."
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>A brief description of what this category represents.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status section */}
            <Card>
              <CardHeader className="bg-muted/50">
                <CardTitle>Category Status</CardTitle>
                <CardDescription>Control category visibility</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Category will be {field.value ? "visible" : "hidden"} to users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div className="lg:col-span-4 col-span-full" variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
              <ImageInput
                  title="Category Icon"
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  endpoint="categoryImage"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Form actions for mobile */}
        <motion.div
          className="flex md:hidden justify-end gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/property-category")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingId ? "Update" : "Create"} Category
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}

