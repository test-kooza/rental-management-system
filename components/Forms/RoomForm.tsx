"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import FormSelectInput from "@/components/FormInputs/FormSelectInput"
import ImageUploader from "@/components/FormInputs/ImageUploader"
import type { Option } from "react-tailwindcss-select/dist/components/type"
import toast from "react-hot-toast"
import { createRoom, updateRoom } from "@/actions/rooms"

// Form schema validation
const roomSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  roomType: z.string().min(1, { message: "Room type is required" }),
  beds: z.coerce.number().min(1, { message: "At least 1 bed is required" }),
  bedType: z.string().optional(),
  maxGuests: z.coerce.number().min(1, { message: "At least 1 guest is required" }),
  isPrivate: z.boolean().default(true),
  hasEnsuite: z.boolean().default(false),
  floorLevel: z.coerce.number().optional(),
  amenities: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof roomSchema>

type RoomFormProps = {
  properties: { id: string; title: string }[]
  initialData?: any
  editingId?: string
}

export default function RoomForm({ properties, initialData, editingId }: RoomFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || [])
  const [propertyOption, setPropertyOption] = useState<Option | null>(
    initialData?.propertyId
      ? {
          value: initialData.propertyId,
          label: properties.find((p) => p.id === initialData.propertyId)?.title || "Unknown Property",
        }
      : null,
  )

  // Convert properties to options for select input
  const propertyOptions = properties.map((property) => ({
    value: property.id,
    label: property.title,
  }))

  // Room type options
  const roomTypeOptions = [
    "Master Bedroom",
    "Guest Bedroom",
    "Living Room",
    "Dining Room",
    "Kitchen",
    "Bathroom",
    "Office",
    "Studio",
    "Other",
  ]

  // Bed type options
  const bedTypeOptions = [
    "King",
    "Queen",
    "Double",
    "Twin",
    "Single",
    "Bunk",
    "Sofa Bed",
    "Floor Mattress",
    "Air Mattress",
    "Crib",
    "Other",
  ]

  // Amenity options
  const amenityOptions = [
    "TV",
    "Air Conditioning",
    "Heating",
    "Desk",
    "Wardrobe",
    "Balcony",
    "Private Bathroom",
    "Fireplace",
    "Mini Fridge",
    "Coffee Maker",
    "Blackout Curtains",
    "Sound System",
    "Safe",
  ]

  const form = useForm<FormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      roomType: initialData?.roomType || "",
      beds: initialData?.beds || 1,
      bedType: initialData?.bedType || "",
      maxGuests: initialData?.maxGuests || 2,
      isPrivate: initialData?.isPrivate ?? true,
      hasEnsuite: initialData?.hasEnsuite ?? false,
      floorLevel: initialData?.floorLevel || 1,
      amenities: initialData?.amenities || [],
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!propertyOption) {
        toast.success("Please select a property for this room")
        setIsSubmitting(false)
        return
      }

      if (imageUrls.length === 0) {
        toast.error("Please upload at least one image for the room")
        setIsSubmitting(false)
        return
      }

      // Prepare room data
      const roomData = {
        ...data,
        propertyId: propertyOption.value,
        images: imageUrls,
      }

      if (editingId) {
        // Update existing room
        const result = await updateRoom({
          id: editingId,
          room: roomData,
        })

        if (result.success) {
          toast.success("The room has been updated successfully")
          router.push("/dashboard/rooms")
          router.refresh()
        } else {
          toast.error( "Failed to update room")
        }
      } else {
        // Create new room
        const result = await createRoom(roomData)

        if (result.success) {
          toast.success("The room has been created successfully")
          form.reset()
          setImageUrls([])
          setPropertyOption(null)
          router.push("/dashboard/rooms")
          router.refresh()
        } else {
          toast.error("Failed to create room")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("There was a problem saving the room")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{editingId ? "Edit Room" : "Create Room"}</h1>
            <p className="text-muted-foreground">
              {editingId ? "Update the details of an existing room" : "Add a new room to your property"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/rooms")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Create"} Room
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Main Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Information</CardTitle>
                <CardDescription>Basic details about the room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Select */}
                <div className="space-y-2">
                  <FormSelectInput
                    options={propertyOptions}
                    label="Property"
                    option={propertyOption}
                    setOption={setPropertyOption}
                    href="/dashboard/properties/new"
                    toolTipText="Add New Property"
                  />
                  {!propertyOption && <p className="text-sm text-destructive">Please select a property</p>}
                </div>

                {/* Title field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room title" {...field} />
                      </FormControl>
                      <FormDescription>A descriptive name for the room</FormDescription>
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
                        <Textarea placeholder="Enter room description" className="resize-none min-h-32" {...field} />
                      </FormControl>
                      <FormDescription>Describe the room's features and ambiance</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Room Type field */}
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roomTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Features</CardTitle>
                <CardDescription>Specify the room's capacity and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Beds field */}
                <FormField
                  control={form.control}
                  name="beds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Beds</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bed Type field */}
                <FormField
                  control={form.control}
                  name="bedType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bed Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bed type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bedTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Guests field */}
                <FormField
                  control={form.control}
                  name="maxGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Guests</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Floor Level field */}
                <FormField
                  control={form.control}
                  name="floorLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>Optional: Which floor the room is on</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-1">
            <Card>
       
              <CardContent>
                <ImageUploader
                  label="Room Images"
                  imageUrls={imageUrls}
                  setImageUrls={setImageUrls}
                  endpoint="roomImage"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Settings</CardTitle>
                <CardDescription>Additional room configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Private Room</FormLabel>
                        <FormDescription>Room is {field.value ? "private" : "shared"} for guests</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasEnsuite"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">En-suite Bathroom</FormLabel>
                        <FormDescription>
                          Room {field.value ? "has" : "does not have"} a private bathroom
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Amenities field */}
                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Room Amenities</FormLabel>
                        <FormDescription>Select all amenities available in this room</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {amenityOptions.map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={amenity}
                              checked={field.value?.includes(amenity)}
                              onChange={(e) => {
                                const updatedAmenities = e.target.checked
                                  ? [...(field.value || []), amenity]
                                  : (field.value || []).filter((a) => a !== amenity)
                                field.onChange(updatedAmenities)
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={amenity} className="text-sm font-medium">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}

