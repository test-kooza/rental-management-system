"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format, differenceInDays } from "date-fns"
import { Star, Calendar, Home, MapPin, Check, Info } from "lucide-react"
import { useProperty, usePropertyReviews, usePropertyRooms } from "@/hooks/useDetaile"
import { checkPropertyAvailability } from "@/actions/property-detailed"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"

import PropertyGallery from "./PropertyGallery"
import RoomCarousel from "./RoomCarousel"
import DateRangePicker from "../dashboard/DateRangePicker"
import AddReviewForm from "../dashboard/AddReviewForm"
import PropertyFooter from "./PropertyFooter"
import PropertyMap from "../Forms/property-map"
import { useBookingStore } from "@/store/use-booking"
import toast from "react-hot-toast"
import { MessageButton } from "../messages/MessageButton"

export type SlugTypes = {
  slug: string
}

export default function PropertyPage({ slug }: SlugTypes) {
  const router = useRouter()
  const { property, isLoading: isPropertyLoading } = useProperty(slug)

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isGuestPopoverOpen, setIsGuestPopoverOpen] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

    const {
    propertyId,
    checkInDate,
    checkOutDate,
    adults,
    children,
    infants,
    totalNights,
    totalPrice,
    setPropertyId,
    setCheckInDate,
    setCheckOutDate,
    setAdults,
    setChildren,
    setInfants,
    setPricing,
    calculateTotalPrice,
  } = useBookingStore()

  const { rooms, isLoading: isRoomsLoading } = usePropertyRooms(property?.id || "")

  const { reviews, isLoading: isReviewsLoading } = usePropertyReviews(property?.id || "")

  useEffect(() => {
    if (property?.id) {
      setPropertyId(property.id)

      if (property.pricing) {
        const basePrice = Number(property.pricing.basePrice)
        const weeklyDiscount = property.pricing.weeklyDiscount ? Number(property.pricing.weeklyDiscount) : 0

        setPricing(basePrice, weeklyDiscount)
      }
    }
  }, [property, setPropertyId, setPricing])

  const formattedImages =
    property?.images.map((url, index) => ({
      id: index,
      url,
      alt: `${property.title} - Image ${index + 1}`,
    })) || []

  const handleReserve = async () => {
    if (!property) return

    if (!(checkInDate instanceof Date) || !(checkOutDate instanceof Date) || 
    isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
  toast.error("Please Clear And Set New Dates");
  return;
}
    try {
      if (property.bookingSettings?.minStay) {
        let stayDuration: number
        try {
          stayDuration = differenceInDays(checkOutDate, checkInDate)
        } catch (error) {
          console.error("Error calculating stay duration:", error)
          toast.error("There was a problem with your selected dates. Please try again.")
          return
        }

        if (stayDuration < property.bookingSettings.minStay) {
          toast.error(`This property requires a minimum stay of ${property.bookingSettings.minStay} nights`)
          return
        }
      }

      if (property.bookingSettings?.maxStay) {
        let stayDuration: number
        try {
          stayDuration = differenceInDays(checkOutDate, checkInDate)
        } catch (error) {
          console.error("Error calculating stay duration:", error)
          toast.error("There was a problem with your selected dates. Please try again.")
          return
        }

        if (stayDuration > property.bookingSettings.maxStay) {
          toast.error(`This property has a maximum stay limit of ${property.bookingSettings.maxStay} nights`)
          return
        }
      }

      if (children > 0 && property.bookingSettings?.allowChildren === false) {
        toast.error("This property does not allow children")
        return
      }

      if (infants > 0 && property.bookingSettings?.allowInfants === false) {
        toast.error("This property does not allow infants")
        return
      }

      setIsCheckingAvailability(true)

      if (!checkInDate || !checkOutDate || 
        isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      toast.error("Please select valid check-in and check-out dates");
      setIsCheckingAvailability(false);
      return;
    }
      const availability = await checkPropertyAvailability(
        property.id,
        checkInDate.toISOString(),
        checkOutDate.toISOString(),
      )

      if (!availability.available) {
        toast.error("This property is not available for the selected dates")
        return
      }

      router.push(`/booking`)
    } catch (error) {
      console.error("Error during reservation:", error)
      toast.error("Failed to check availability. Please try again.")
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  if (isPropertyLoading) {
    return <PropertySkeleton />
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    )
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Add date"
    try {
      return format(date, "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto ">
      <PropertyGallery
        title={property.title}
        subtitle={`${property.bedrooms} bedrooms · ${property.beds} beds · ${property.bathrooms} bathrooms`}
        images={formattedImages}
      />

      <div className="flex flex-col lg:flex-row gap-8 p-4 md:pt-8 relative">
        <div className="w-full lg:w-7/12">
          <div className="border-b pb-6 mb-6 md:block hidden">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-medium">{property.title}</h1>
                <p className="text-gray-600 text-sm">{`${property.bedrooms} bedrooms · ${property.beds} beds · ${property.bathrooms} bathrooms`}</p>
              </div>
              <div className="hidden md:block">
                <Image
                  src={property.host.image || "https://github.com/shadcn.png"}
                  alt={property.host.name}
                  width={56}
                  height={56}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="mt-2">
              <span className="flex items-center">
                <Star className="mr-1 h-4 w-4" />
                {property.reviewCount > 0 ? `${property.avgRating} · ${property.reviewCount} reviews` : "New property"}
              </span>
            </div>
          </div>

          {/* Host Details */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-base font-medium">Hosted by {property.host.name}</p>
                <p className="text-gray-600 text-sm">{property.host.yearsHosting} years hosting</p>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="border-b pb-6 mb-6 space-y-4">
            <div className="flex items-center text-base">
              <div className="mr-4 text-xl">
               <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/4d090f93-f9a5-4f06-95e4-ca737c0d0ab5.png" alt="" className="w-5 h-5"/>
              </div>
              <div>
                <p className="font-medium text-sm">{property.category.name}</p>
                <p className="text-gray-600 text-xs">Category</p>
              </div>
            </div>
            <div className="flex items-center text-base">
              <div className="mr-4 text-xl">
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/4d090f93-f9a5-4f06-95e4-ca737c0d0ab5.png" alt="" className="w-5 h-5"/>
              </div>
              <div>
                <p className="font-medium text-sm">
                  {property.address?.city}, {property.address?.country}
                </p>
                <p className="text-gray-600 text-sm">{property.address?.formattedAddress || property.address?.street}</p>
              </div>
            </div>
            <div className="flex items-center text-base">
              <div className="mr-4 text-xl">
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/4d090f93-f9a5-4f06-95e4-ca737c0d0ab5.png" alt="" className="w-5 h-5"/>
              </div>
              <div>
                <p className="font-medium text-sm">
                  {property.bookingSettings?.cancellationPolicy === "FLEXIBLE" && "Free cancellation before check-in"}
                  {property.bookingSettings?.cancellationPolicy === "MODERATE" &&
                    "Free cancellation up to 5 days before check-in"}
                  {property.bookingSettings?.cancellationPolicy === "STRICT" &&
                    "Free cancellation up to 14 days before check-in"}
                </p>
                <p className="text-gray-600 text-sm">
                  Cancellation policy: {property.bookingSettings?.cancellationPolicy.toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-medium mb-4">About this place</h2>
            <p className="text-gray-700 text-base">{property.description}</p>
          
          <div className="mt-4">
          <MessageButton
            propertyId={property.id}
            hostId={property.host.id}
            />
          </div>
          </div>

          {rooms && rooms.length > 0 && (
            <div className="border-b pb-6 mb-6">
              <RoomCarousel rooms={rooms} />
            </div>
          )}

          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-medium mb-4">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              {property.amenities &&
                Object.entries(property.amenities).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className="flex items-center text-sm">
                        <Check className="mr-3 h-3 w-3 bg-primary  text-white" />
                        <span>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</span>
                      </div>
                    ),
                )}
            </div>
            <button  className="mt-6 text-xs underline">
              Show all amenities
            </button>
          </div>

          <div className="border-b pb-6 mb-6">
            <h2 className="text-base font-semibold mb-4">Select your dates</h2>

            <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <DialogTrigger asChild>
                <div className="border rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors">
                  <div className="grid grid-cols-2 gap-4  ">
                    <div className="border-r border-gray-200">
                      <p className="text-xs font-medium">CHECK-IN</p>
                      <p className="text-xs mt-2">{formatDate(checkInDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium">CHECKOUT</p>
                      <p className="text-xs mt-2">{formatDate(checkOutDate)}</p>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DateRangePicker
                  initialStartDate={checkInDate}
                  initialEndDate={checkOutDate}
                  onStartDateChange={setCheckInDate}
                  onEndDateChange={setCheckOutDate}
                  minDate={new Date()}
                  disabled={!property.isAvailable}
                />
              </DialogContent>
            </Dialog>

            {totalNights > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {totalNights} {totalNights === 1 ? "night" : "nights"} selected
              </p>
            )}
          </div>

          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-medium mb-4">Where you'll be</h2>
            <p className="text-gray-600 mb-4">
              {property.address?.city}, {property.address?.country}
            </p>

            {property.address?.latitude && property.address?.longitude && (
              <PropertyMap
                position={[Number(property.address.latitude), Number(property.address.longitude)]}
                readOnly={true}
              />
            )}
          </div>

          {/* Reviews */}
          <div className="mb-6">
            <Tabs defaultValue="reviews">
              <TabsList className="w-full">
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews ({property.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="add-review" className="flex-1">
                  Add Review
                </TabsTrigger>
              </TabsList>

              <TabsContent value="reviews" className="pt-4">
                {isReviewsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium mr-3 overflow-hidden">
                            {review.author.image ? (
                              <Image
                                src={review.author.image || "/placeholder.jpg"}
                                alt={review.author.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              review.author.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{review.author.name}</p>
                            <p className="text-gray-600 text-sm">{format(new Date(review.createdAt), "MMMM yyyy")}</p>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="add-review" className="pt-4">
                <AddReviewForm
                  propertyId={property.id}
                  onSuccess={() => {
                    toast.success("Thank you for your feedback!")
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="w-full lg:w-[35%] lg:relative ">
          <div className="lg:sticky lg:top-32 ">
            <Card className="shadow-lg border rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-baseline gap-2">
                    {property.pricing?.basePrice && (
                      <>
                        {property.pricing.weeklyDiscount && Number(property.pricing.weeklyDiscount) > 0 && (
                          <span className="text-xs line-through text-gray-500">
                            {property.pricing.currency}
                            {Number(property.pricing.basePrice).toLocaleString()}
                          </span>
                        )}
                        <span className="text-base font-semibold">
                          {property.pricing.currency}
                          {property.pricing.weeklyDiscount && Number(property.pricing.weeklyDiscount) > 0
                            ? (
                                Number(property.pricing.basePrice) *
                                (1 - Number(property.pricing.weeklyDiscount) / 100)
                              ).toLocaleString()
                            : Number(property.pricing.basePrice).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">night</span>
                      </>
                    )}
                  </div>

                  {property.reviewCount > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      <span>
                        {property.avgRating} · {property.reviewCount} reviews
                      </span>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg overflow-hidden mb-4">
                  <div className="grid grid-cols-2 divide-x">
                    <div
                      className="p-3 border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setIsDatePickerOpen(true)
                        setIsGuestPopoverOpen(false)
                      }}
                    >
                      <div className="text-xs font-bold uppercase mt-2">CHECK-IN</div>
                      <div className="text-xs">{formatDate(checkInDate)}</div>
                    </div>
                    <div
                      className="p-3 border-b cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setIsDatePickerOpen(true)
                        setIsGuestPopoverOpen(false)
                      }}
                    >
                      <div className="text-xs font-bold uppercase mt-2">CHECKOUT</div>
                      <div className="text-xs">{formatDate(checkOutDate)}</div>
                    </div>
                  </div>
                  <Popover open={isGuestPopoverOpen} onOpenChange={setIsGuestPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="p-3 cursor-pointer hover:bg-gray-50">
                        <div className="text-xs font-bold uppercase">GUESTS</div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">
                            {adults + children} {adults + children === 1 ? "guest" : "guests"}
                            {infants > 0 && `, ${infants} ${infants === 1 ? "infant" : "infants"}`}
                          </span>
                          <span className="text-xs">▼</span>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">Adults</div>
                            <div className="text-sm text-gray-500">Age 13+</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              disabled={adults <= 1}
                            >
                              -
                            </Button>
                            <span>{adults}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setAdults(adults + 1)}
                              disabled={adults + children >= property.maxGuests}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">Children</div>
                            <div className="text-sm text-gray-500">Ages 2-12</div>
                            {property.bookingSettings?.allowChildren === false && (
                              <div className="text-xs text-red-500 flex items-center mt-1">
                                <Info className="h-3 w-3 mr-1" />
                                Not allowed at this property
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              disabled={children <= 0}
                            >
                              -
                            </Button>
                            <span>{children}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setChildren(children + 1)}
                              disabled={
                                adults + children >= property.maxGuests ||
                                property.bookingSettings?.allowChildren === false
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">Infants</div>
                            <div className="text-sm text-gray-500">Under 2</div>
                            {property.bookingSettings?.allowInfants === false && (
                              <div className="text-xs text-red-500 flex items-center mt-1">
                                <Info className="h-3 w-3 mr-1" />
                                Not allowed at this property
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setInfants(Math.max(0, infants - 1))}
                              disabled={infants <= 0}
                            >
                              -
                            </Button>
                            <span>{infants}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => setInfants(infants + 1)}
                              disabled={property.bookingSettings?.allowInfants === false}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="text-sm text-gray-500">
                          This property has a maximum of {property.maxGuests} guests, excluding infants.
                        </div>

                        <Button variant="outline" className="w-full" onClick={() => setIsGuestPopoverOpen(false)}>
                          Close
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  className="w-full py-4 bg-[#e41d58] hover:bg-rose-700 text-white font-medium text-sm rounded-lg mb-4 hidden md:flex"
                  onClick={handleReserve}
                  disabled={!property.isAvailable || isCheckingAvailability}
                >
                  {isCheckingAvailability ? "Checking availability..." : "Reserve"}
                </Button>

                {!property.isAvailable && (
                  <div className="text-center text-red-500 mb-4">
                    This property is currently not available for booking
                  </div>
                )}

                <p className="text-center text-gray-500 mb-4 text-sm">You won't be charged yet</p>

                {checkInDate && checkOutDate && totalNights > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="underline text-sm">
                        {property.pricing?.currency}
                        {property.pricing?.weeklyDiscount && Number(property.pricing.weeklyDiscount) > 0
                          ? (
                              Number(property.pricing.basePrice) *
                              (1 - Number(property.pricing.weeklyDiscount) / 100)
                            ).toLocaleString()
                          : Number(property.pricing?.basePrice || 0).toLocaleString()}{" "}
                        x {totalNights} nights
                      </span>
                      <span className="text-sm">
                        {property.pricing?.currency}
                        {totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {property.pricing?.cleaningFee && Number(property.pricing.cleaningFee) > 0 && (
                      <div className="flex justify-between">
                        <span className="underline text-sm">Cleaning fee</span>
                        <span className="text-sm">
                          {property.pricing.currency}
                          {Number(property.pricing.cleaningFee).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {property.pricing?.serviceFee && Number(property.pricing.serviceFee) > 0 && (
                      <div className="flex justify-between">
                        <span className="underline text-sm">Service fee</span>
                        <span className="text-sm">
                          {property.pricing.currency}
                          {Number(property.pricing.serviceFee).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-4 border-t font-semibold">
                      <span className="text-sm">Total before taxes</span>
                      <span className="text-sm">
                        {property.pricing?.currency}
                        {(
                          totalPrice +
                          Number(property.pricing?.cleaningFee || 0) +
                          Number(property.pricing?.serviceFee || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center mt-4">
              <button className="text-gray-600 underline text-xs">Report this listing</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="block md:hidden">
        <PropertyFooter
          originalPrice={
            property.pricing?.weeklyDiscount && Number(property.pricing.weeklyDiscount) > 0
              ? `${property.pricing?.currency}${Number(property.pricing?.basePrice || 0).toLocaleString()}`
              : ""
          }
          onReserve={handleReserve}
          discountedPrice={`${property.pricing?.currency}${
            property.pricing?.weeklyDiscount && Number(property.pricing.weeklyDiscount) > 0
              ? (
                  Number(property.pricing?.basePrice || 0) *
                  (1 - Number(property.pricing.weeklyDiscount) / 100)
                ).toLocaleString()
              : Number(property.pricing?.basePrice || 0).toLocaleString()
          }`}
        />
      </div>
    </div>
  )
}

// Skeleton loader for property page
function PropertySkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="h-[450px] w-full rounded-lg overflow-hidden mb-8">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-7/12">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />

          <div className="space-y-8">
            <div>
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div>
              <Skeleton className="h-8 w-1/4 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%] hidden lg:block">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

