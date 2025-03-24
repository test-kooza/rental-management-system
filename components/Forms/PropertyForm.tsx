"use client"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { PropertyStyle } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import FormSelectInput from "@/components/FormInputs/FormSelectInput"
import type { Option } from "react-tailwindcss-select/dist/components/type"
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import PropertyMap from "./PropertyMap"
import ImageUploader from "../FormInputs/ImageUploader"
import toast from "react-hot-toast"
import { createProperty, updateProperty } from "@/actions/property"
import CountrySelect from "../FormInputs/CountrySelect"
import CurrencySelect from "../FormInputs/CurrencySelect"


const amenitiesData = [
  { id: "hasWifi", label: "WiFi" },
  { id: "hasAC", label: "Air Conditioning" },
  { id: "hasParking", label: "Parking" },
  { id: "hasKitchen", label: "Kitchen" },
  { id: "hasPool", label: "Pool" },
  { id: "hasGym", label: "Gym" },
  { id: "hasTv", label: "TV" },
  { id: "isBeachfront", label: "Beachfront" },
  { id: "isMountainView", label: "Mountain View" },
  { id: "isPetFriendly", label: "Pet Friendly" },
  { id: "hasDishwasher", label: "Dishwasher" },
  { id: "hasWasher", label: "Washer" },
  { id: "hasDryer", label: "Dryer" },
  { id: "hasHotTub", label: "Hot Tub" },
  { id: "hasFireplace", label: "Fireplace" },
  { id: "hasWorkspace", label: "Workspace" },
  { id: "hasBBQGrill", label: "BBQ Grill" },
  { id: "hasPatio", label: "Patio/Balcony" },
  { id: "hasElevator", label: "Elevator" },
  { id: "hasSecurityCamera", label: "Security Camera" },
]

// Define property styles
const propertyStyleOptions = [
  { value: "PEACEFUL", label: "Peaceful" },
  { value: "UNIQUE", label: "Unique" },
  { value: "FAMILY_FRIENDLY", label: "Family Friendly" },
  { value: "STYLISH", label: "Stylish" },
  { value: "CENTRAL", label: "Central" },
  { value: "SPACIOUS", label: "Spacious" },
]

// Form schema
const propertyFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  shortDescription: z.string().optional(),
  propertyStyle: z.array(z.nativeEnum(PropertyStyle)).min(1, "Select at least one property style"),
  categoryId: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  amenities: z.record(z.boolean()).refine((data) => Object.values(data).some((value) => value === true), {
    message: "At least one amenity must be selected",
  }),
  maxGuests: z.number().min(1, "At least 1 guest is required"),
  bedrooms: z.number().min(1, "At least 1 bedroom is required"),
  beds: z.number().min(1, "At least 1 bed is required"),
  bathrooms: z.number().min(0.5, "At least 0.5 bathroom is required"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    neighborhood: z.string().optional(),
    isExactLocation: z.boolean().default(true),
  }),
  pricing: z.object({
    basePrice: z.number().min(1, "Base price is required"),
    cleaningFee: z.number().optional(),
    serviceFee: z.number().optional(),
    taxRate: z.number().optional(),
    weeklyDiscount: z.number().min(0).max(100, "Discount must be between 0-100%").optional(),
    monthlyDiscount: z.number().min(0).max(100, "Discount must be between 0-100%").optional(),
    currency: z.string().default("USD"),
  }),
  bookingSettings: z.object({
    instantBooking: z.boolean().default(false),
    minStay: z.number().min(1, "Minimum stay must be at least 1 night"),
    maxStay: z.number().optional(),
    checkInTime: z.string().default("15:00"),
    checkOutTime: z.string().default("11:00"),
    allowChildren: z.boolean().default(true),
    allowInfants: z.boolean().default(true),
    allowPets: z.boolean().default(false),
    allowSmoking: z.boolean().default(false),
    allowParties: z.boolean().default(false),
    cancellationPolicy: z.string().default("MODERATE"),
    advanceBookingWindow: z.number().default(365),
  }),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

type PropertyFormProps = {
  categories: Array<{ id: string; name: string }>
  hostId: string
  property?: any // Optional property for editing
}

interface PropertyFormData extends Omit<PropertyFormValues, 'amenities'> {
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
    hasDishwasher?: boolean;
    hasWasher?: boolean;
    hasDryer?: boolean;
    hasHotTub?: boolean;
    hasFireplace?: boolean;
    hasWorkspace?: boolean;
    hasBBQGrill?: boolean;
    hasPatio?: boolean;
    hasElevator?: boolean;
    hasSecurityCamera?: boolean;
  };
}

export default function PropertyForm({ categories, hostId, property }: PropertyFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 5
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryOption, setCategoryOption] = useState<Option | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [mapPosition, setMapPosition] = useState<[number, number] | null>(null)

  // Transform categories to options for the select input
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }))

  // Define default amenities values
  const defaultAmenities = amenitiesData.reduce((acc, amenity) => ({ ...acc, [amenity.id]: false }), {})

  // For editing: populate form with existing property data
  const defaultValues: Partial<PropertyFormValues> = property
    ? {
        title: property.title,
        description: property.description,
        shortDescription: property.shortDescription || "",
        propertyStyle: property.propertyStyle,
        categoryId: property.categoryId,
        images: property.images,
        amenities: property.amenities,
        maxGuests: property.maxGuests,
        bedrooms: property.bedrooms,
        beds: property.beds,
        bathrooms: property.bathrooms,
        address: property.address,
        pricing: {
          basePrice: property.pricing?.basePrice || 100,
          cleaningFee: property.pricing?.cleaningFee || 25,
          serviceFee: property.pricing?.serviceFee || 15,
          taxRate: property.pricing?.taxRate || 10,
          weeklyDiscount: property.pricing?.weeklyDiscount || 0,
          monthlyDiscount: property.pricing?.monthlyDiscount || 0,
          currency: property.pricing?.currency || "USD",
        },
        bookingSettings: {
          instantBooking: property.bookingSettings?.instantBooking || false,
          minStay: property.bookingSettings?.minStay || 1,
          maxStay: property.bookingSettings?.maxStay || 30,
          checkInTime: property.bookingSettings?.checkInTime || "15:00",
          checkOutTime: property.bookingSettings?.checkOutTime || "11:00",
          allowChildren: property.bookingSettings?.allowChildren ?? true,
          allowInfants: property.bookingSettings?.allowInfants ?? true,
          allowPets: property.bookingSettings?.allowPets ?? false,
          allowSmoking: property.bookingSettings?.allowSmoking ?? false,
          allowParties: property.bookingSettings?.allowParties ?? false,
          cancellationPolicy: property.bookingSettings?.cancellationPolicy || "MODERATE",
          advanceBookingWindow: property.bookingSettings?.advanceBookingWindow || 365,
        },
        isPublished: property.isPublished || false,
        isFeatured: property.isFeatured || false,
      }
    : {
        title: "",
        description: "",
        shortDescription: "",
        propertyStyle: [],
        categoryId: "",
        images: [],
        amenities: defaultAmenities,
        maxGuests: 1,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          isExactLocation: true,
        },
        pricing: {
          basePrice: 100,
          cleaningFee: 25,
          serviceFee: 15,
          taxRate: 10,
          weeklyDiscount: 0,
          monthlyDiscount: 0,
          currency: "USD",
        },
        bookingSettings: {
          instantBooking: false,
          minStay: 1,
          maxStay: 30,
          checkInTime: "15:00",
          checkOutTime: "11:00",
          allowChildren: true,
          allowInfants: true,
          allowPets: false,
          allowSmoking: false,
          allowParties: false,
          cancellationPolicy: "MODERATE",
          advanceBookingWindow: 365,
        },
        isPublished: false,
        isFeatured: false,
      }

  // Setup form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Initialize state values from form for editing
  useEffect(() => {
    if (property) {
      setImageUrls(property.images || [])

      // Set category option for the custom select
      if (property.categoryId) {
        const category = categories.find((c) => c.id === property.categoryId)
        if (category) {
          setCategoryOption({
            value: category.id,
            label: category.name,
          })
        }
      }

      // Set map position if latitude and longitude are available
      if (property.address?.latitude && property.address?.longitude) {
        setMapPosition([property.address.latitude, property.address.longitude])
      }


      // Force form validation after initialization
      form.trigger()
    }
  }, [property, categories, form])

  // Watch form values to update images and map position
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "images") {
        setImageUrls(value.images as string[])
      }
    })

    return () => subscription.unsubscribe()
  }, [form.watch])

  // Handle map position update
  const handleMapPositionChange = (position: [number, number]) => {
    setMapPosition(position)
    form.setValue("address.latitude", position[0])
    form.setValue("address.longitude", position[1])
  }

  // Handle category selection
  const handleCategoryChange = (option: any ) => {
    setCategoryOption(option)
    if (option) {
      form.setValue("categoryId", option.value as string)
    } else {
      form.setValue("categoryId", "")
    }
  }

  // Handle form submission
  const onSubmit = async (data: PropertyFormValues) => {
    console.log("onSubmit triggered", { property, data })
    setIsSubmitting(true)

    try {
      // Ensure bookingSettings is defined
      const bookingSettings = data.bookingSettings || {
        instantBooking: false,
        minStay: 1,
        maxStay: 30,
        checkInTime: "15:00",
        checkOutTime: "11:00",
        allowChildren: true,
        allowInfants: true,
        allowPets: false,
        allowSmoking: false,
        allowParties: false,
        cancellationPolicy: "MODERATE",
        advanceBookingWindow: 365,
      }

      // Ensure all pricing fields have valid values
      const pricing = {
        ...data.pricing,
        cleaningFee: data.pricing.cleaningFee ?? 0,
        serviceFee: data.pricing.serviceFee ?? 0,
        taxRate: data.pricing.taxRate ?? 0,
        weeklyDiscount: data.pricing.weeklyDiscount ?? 0,
        monthlyDiscount: data.pricing.monthlyDiscount ?? 0,
      }

      // Add host ID to the data
      const propertyData= {
        ...data,
        hostId,
        bookingSettings: bookingSettings,
        pricing: pricing,
        amenities: {
          hasWifi: data.amenities.hasWifi || false,
          hasAC: data.amenities.hasAC || false,
          hasParking: data.amenities.hasParking || false,
          hasKitchen: data.amenities.hasKitchen || false,
          hasPool: data.amenities.hasPool || false,
          hasGym: data.amenities.hasGym || false,
          hasTv: data.amenities.hasTv || false,
          isBeachfront: data.amenities.isBeachfront || false,
          isMountainView: data.amenities.isMountainView || false,
          isPetFriendly: data.amenities.isPetFriendly || false,
          ...data.amenities,
        }
      }

      // Log the data being submitted for debugging
      console.log("Submitting data:", propertyData)

      let result

      if (property) {
        // Update existing property
        result = await updateProperty(property.id, propertyData)
      } else {
        // Create new property
        result = await createProperty(propertyData)
      }

      if (result.success) {
        toast.success(property ? "Property updated successfully!" : "Property created successfully!")
        router.push("/dashboard/properties")
      } else {
        toast.error(result.error || "Failed to save property")
        console.error("Error from server:", result.error)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Validate current step before proceeding
  const validateStep = async () => {
    let isValid = false

    switch (step) {
      case 1: // Basic details
        isValid = await form.trigger(["title", "description", "shortDescription", "categoryId", "propertyStyle"])
        break
      case 2: // Images
        isValid = await form.trigger(["images"])
        break
      case 3: // Features and amenities
        isValid = await form.trigger(["maxGuests", "bedrooms", "beds", "bathrooms", "amenities"])
        break
      case 4: // Location
        isValid = await form.trigger(["address.street", "address.city", "address.country"])
        // if (isValid && !mapPosition) {
        //   toast.error("Please select a location on the map")
        //   isValid = false
        // }
        break
      case 5:
        // For the final step, we'll validate all fields to ensure the form can be submitted
        // isValid = await form.trigger()
        break
      default:
        isValid = true
    }

    if (isValid) {
      nextStep()
    } else {
      // Show form errors
      const errors = form.formState.errors
      if (Object.keys(errors).length > 0) {
        console.log("Form validation errors:", errors)
        toast.error("Please fix the form errors before proceeding")
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation errors:", errors)
          toast.error("Please fix the form errors before submitting Choose Location Current Location From The Map")
        })}
        className="space-y-6"
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle>{property ? "Update Property" : "Create New Property"}</CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {/* Step Indicator */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        step > index + 1
                          ? "bg-primary text-white"
                          : step === index + 1
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">
                      {index === 0 && "Basic Info"}
                      {index === 1 && "Images"}
                      {index === 2 && "Features"}
                      {index === 3 && "Location"}
                      {index === 4 && "Pricing"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step 1: Basic Details */}
            {step === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a catchy title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive title helps attract guests (minimum 10 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your property in detail" className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include all details that would help guests understand your property (minimum 50 characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief summary of your property" className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormDescription>A short summary that will appear in search results.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Category</FormLabel>
                        <FormControl>
                          <div className="mt-1">
                            <FormSelectInput
                              options={categoryOptions}
                              label="Category"
                              option={categoryOption}
                              setOption={handleCategoryChange}
                              href="/dashboard/property-category"
                              toolTipText="Add a new category"
                              labelShown={false}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Style</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {propertyStyleOptions.map((style) => (
                              <div key={style.value} className="flex items-center">
                                <Checkbox
                                  id={`style-${style.value}`}
                                  checked={field.value.includes(style.value as PropertyStyle)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, style.value as PropertyStyle])
                                    } else {
                                      field.onChange(field.value.filter((value) => value !== style.value))
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`style-${style.value}`}
                                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {style.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>Select at least one style that describes your property.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Images */}
            {step === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader
                          label="Property Images"
                          imageUrls={imageUrls}
                          setImageUrls={(urls: string[]) => {
                            setImageUrls(urls)
                            field.onChange(urls)
                          }}
                          endpoint="propertyImages"
                        />
                      </FormControl>
                      <FormDescription>Upload high-quality images of your property (up to 4 images).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Features and Amenities */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="maxGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guests</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="beds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0.5}
                            step={0.5}
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0.5)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amenities</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                          {amenitiesData.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`amenity-${amenity.id}`}
                                checked={field.value?.[amenity.id] || false}
                                onCheckedChange={(checked) => {
                                  field.onChange({
                                    ...field.value,
                                    [amenity.id]: !!checked,
                                  })
                                }}
                              />
                              <label
                                htmlFor={`amenity-${amenity.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {amenity.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>Select all amenities your property offers.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Location */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <CountrySelect
                            value={field.value}
                            onChange={field.onChange}
                            labelShown={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address.neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Neighborhood (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Downtown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address.isExactLocation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Show Exact Location</FormLabel>
                        <FormDescription>
                          Enable to show your exact location on the map, or disable to show only the general area.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Location on Map</h3>
                  <p className="text-sm text-muted-foreground">
                    Place the marker on your property's location. Click on the map to set the position.
                  </p>
                  <div className="h-[400px] rounded-md overflow-hidden">
                    <PropertyMap position={mapPosition} onPositionChange={handleMapPositionChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pricing and Booking Settings */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="pricing.basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price (per night)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={field.value || 100}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing.cleaningFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cleaning Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing.serviceFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Fee</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing.taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const value = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pricing.weeklyDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            value={field.value}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Discount percentage for stays of 7+ nights</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pricing.monthlyDiscount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            value={field.value}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Discount percentage for stays of 28+ nights</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pricing.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <CurrencySelect
                          value={field.value}
                          onChange={field.onChange}
                          labelShown={false}
                        />
                      </FormControl>
                      <FormDescription>Currency used for pricing and transactions</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="text-lg font-medium mt-8">Booking Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bookingSettings.minStay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stay (nights)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={field.value || 1}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingSettings.maxStay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Stay (nights)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            value={field.value || 30}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 30)}
                          />
                        </FormControl>
                        <FormDescription>Leave empty for no maximum</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingSettings.checkInTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} value={field.value || "15:00"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bookingSettings.checkOutTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} value={field.value || "11:00"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bookingSettings.cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "MODERATE"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select policy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FLEXIBLE">Flexible (Full refund 1 day prior to arrival)</SelectItem>
                          <SelectItem value="MODERATE">Moderate (Full refund 5 days prior to arrival)</SelectItem>
                          <SelectItem value="STRICT">Strict (Full refund 14 days prior to arrival)</SelectItem>
                          <SelectItem value="NON_REFUNDABLE">Non-refundable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the cancellation policy for your property</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h4 className="font-medium">House Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bookingSettings.allowChildren"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Children</FormLabel>
                            <FormDescription>Children are welcome at this property</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingSettings.allowInfants"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Infants</FormLabel>
                            <FormDescription>Infants are welcome at this property</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingSettings.allowPets"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Pets</FormLabel>
                            <FormDescription>Pets are allowed at this property</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingSettings.allowSmoking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Smoking</FormLabel>
                            <FormDescription>Smoking is allowed at this property</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingSettings.allowParties"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Parties</FormLabel>
                            <FormDescription>Parties/events are allowed at this property</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="bookingSettings.instantBooking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Instant Booking</FormLabel>
                        <FormDescription>Allow guests to book instantly without approval</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-primary/5 disabled:bg-primary/5">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Property</FormLabel>
                        <FormDescription>Make this property visible to guests</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}

              {step < totalSteps && (
                <Button type="button" onClick={validateStep} className="ml-auto flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {step === totalSteps && (
                <Button type="submit" className="ml-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {property ? "Updating..." : "Creating..."}
                    </>
                  ) : property ? (
                    "Update Property"
                  ) : (
                    "Create Property"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

