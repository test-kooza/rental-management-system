"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { getPropertyDetails, type PropertyDetails } from "@/actions/property"
import { useBookingStore } from "@/store/use-booking"
import { type BookingFormData, createStripeCheckoutSession } from "@/actions/payments"
import toast from "react-hot-toast"
import CountrySelect from "../FormInputs/CountrySelect"

const formSchema = z.object({
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  aptSuite: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZIP code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  phoneNumber: z.string().optional(),
})

export default function BookingPage() {
  const [paymentOption, setPaymentOption] = useState<"full" | "partial">("full")
  const [isLoading, setIsLoading] = useState(false)
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null)
  const [isLoadingProperty, setIsLoadingProperty] = useState(true)
  const router = useRouter()

  const bookingStore = useBookingStore()

  useEffect(() => {
    if (!bookingStore.propertyId || !bookingStore.checkInDate || !bookingStore.checkOutDate) {
      router.push("/")
    }
  }, [bookingStore, router])

  useEffect(() => {
    async function loadPropertyDetails() {
      if (bookingStore.propertyId) {
        setIsLoadingProperty(true)
        const details = await getPropertyDetails(bookingStore.propertyId)
        setPropertyDetails(details)
        setIsLoadingProperty(false)
      }
    }

    loadPropertyDetails()
  }, [bookingStore.propertyId])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetAddress: "",
      aptSuite: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Uganda",
      phoneNumber: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const bookingData = {
        propertyId: bookingStore.propertyId,
        checkInDate: bookingStore.checkInDate,
        checkOutDate: bookingStore.checkOutDate,
        adults: bookingStore.adults,
        children: bookingStore.children,
        infants: bookingStore.infants,
        totalNights: bookingStore.totalNights,
        basePrice: bookingStore.basePrice,
        totalPrice: paymentOption === "full" ? bookingStore.totalPrice : bookingStore.totalPrice * 0.2,
        discountPercentage: bookingStore.discountPercentage,
        property: {
          name: propertyDetails?.title || "Property",
          image: propertyDetails?.images?.[0] || "",
        },
      }

      // Create Stripe checkout session
      const result = await createStripeCheckoutSession(values as BookingFormData, bookingData)

      if (result.success && result.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl
      } else {
        toast.error(`${result.error}|| "Failed to create checkout session"`)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast.error("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  // Format dates for display
  const formattedCheckIn = bookingStore.checkInDate ? format(bookingStore.checkInDate, "MMM dd, yyyy") : ""
  const formattedCheckOut = bookingStore.checkOutDate ? format(bookingStore.checkOutDate, "MMM dd, yyyy") : ""

  // Calculate pricing
  const nightlyRate = bookingStore.basePrice
  const totalNights = bookingStore.totalNights
  const subtotal = nightlyRate * totalNights
  const discount = bookingStore.discountPercentage ? subtotal * (bookingStore.discountPercentage / 100) : 0
  const taxes = (subtotal - discount) * 0.15 // Assuming 15% tax
  const total = subtotal - discount + taxes

  // Format currency
  const formatCurrency = (amount: number) => `US$${amount.toFixed(2)}`

  return (
    <div className="container mx-auto px-4 py-8 mb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button variant="link" className="flex items-center text-gray-700" onClick={() => router.back()}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            <span className="text-base font-semibold">Back</span>
          </Button>
          <h1 className="text-2xl font-bold mt-4">Confirm and pay</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Form */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-8">
              <h2 className="text-base font-medium mb-6">Your trip</h2>

              <div className="border-b pb-6 mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-medium mb-1">Dates</h3>
                    <p className="text-gray-600">
                      {formattedCheckIn} - {formattedCheckOut}
                    </p>
                  </div>
                  <button className="text-gray-700 underline" onClick={() => router.back()}>
                    Edit
                  </button>
                </div>

                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium mb-1">Guests</h3>
                    <p className="text-gray-600">
                      {bookingStore.adults} {bookingStore.adults === 1 ? "adult" : "adults"}
                      {bookingStore.children > 0 &&
                        `, ${bookingStore.children} ${bookingStore.children === 1 ? "child" : "children"}`}
                      {bookingStore.infants > 0 &&
                        `, ${bookingStore.infants} ${bookingStore.infants === 1 ? "infant" : "infants"}`}
                    </p>
                  </div>
                  <button className="text-gray-700 underline" onClick={() => router.back()}>
                    Edit
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-base font-medium mb-4">Choose how to pay</h2>

                <div className="space-y-4">
                  <div
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer",
                      paymentOption === "full" ? "border-black" : "",
                    )}
                    onClick={() => setPaymentOption("full")}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pay {formatCurrency(total)} now</p>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center">
                        {paymentOption === "full" && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "border rounded-lg p-4 cursor-pointer",
                      paymentOption === "partial" ? "border-black" : "",
                    )}
                    onClick={() => setPaymentOption("partial")}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Pay part now, part later</p>
                        <p className="text-gray-600 text-xs mt-1">
                          {formatCurrency(total * 0.2)} due today, {formatCurrency(total * 0.8)} on{" "}
                          {bookingStore.checkInDate
                            ? format(
                                new Date(bookingStore.checkInDate.getTime() - 14 * 24 * 60 * 60 * 1000),
                                "MMM dd, yyyy",
                              )
                            : ""}
                          . No extra fees.
                        </p>
                        <button className="text-black underline text-xs mt-1">More info</button>
                      </div>
                      <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center">
                        {paymentOption === "partial" && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-base font-medium mb-4">Billing address</h2>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Street address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300" placeholder="Enter your street address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aptSuite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apt or suite number</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300" placeholder="Optional" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            City <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-gray-300" placeholder="Enter your city" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              State <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="border-gray-300" placeholder="Enter your state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              ZIP code <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} className="border-gray-300" placeholder="Enter your ZIP code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Country/region <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <CountrySelect
                              value={field.value}
                              onChange={field.onChange}
                              label="Country/region"
                              labelShown={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="border-gray-300"
                              type="tel"
                              placeholder="Enter your phone number"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-gray-600 text-xs mt-1">For trip updates and questions about your stay</p>
                        </FormItem>
                      )}
                    />

                    <div className="border-t my-8"></div>

                    <div className="mb-8">
                      <h2 className="text-base font-medium mb-4">Cancellation policy</h2>

                      <p className="text-gray-700">
                        <span className="font-medium">
                          Free cancellation before{" "}
                          {bookingStore.checkInDate
                            ? format(new Date(bookingStore.checkInDate.getTime() - 5 * 24 * 60 * 60 * 1000), "MMM dd")
                            : ""}
                          .
                        </span>{" "}
                        Cancel before check-in on {formattedCheckIn} for a partial refund.{" "}
                        <button className="underline font-medium">Learn more</button>
                      </p>
                    </div>

                    <div className="border-t my-8"></div>

                    <div className="mb-8">
                      <h2 className="text-base font-medium mb-4">Ground rules</h2>

                      <p className="text-gray-700 mb-4">
                        We ask every guest to remember a few simple things about what makes a great guest.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                        <li>Follow the house rules</li>
                        <li>Treat your Host's home like your own</li>
                      </ul>
                    </div>

                    <div className="text-xs text-gray-600 mb-8">
                      By clicking the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's
                      Rebooking and Refund Policy, and that Airbnb can charge my payment method if I'm responsible for
                      damage.
                    </div>

                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-[#FF385C] hover:bg-[#E31C5F] text-white py-4 px-6 rounded-lg text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm and pay"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Right column - Price details (sticky on desktop) */}
          <div className="w-full lg:w-[35%] lg:relative hidden md:block">
            <div className="lg:sticky lg:top-32">
              <Card className="shadow-lg border rounded-xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                      {isLoadingProperty ? (
                        <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                      ) : (
                        <img
                          src={propertyDetails?.images?.[0] || "/placeholder.svg"}
                          alt={propertyDetails?.title || "Property"}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        {isLoadingProperty ? (
                          <>
                            <div className="h-3 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                            <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                          </>
                        ) : (
                          <>
                            <h3 className="text-xs">{propertyDetails?.title || "Property"}</h3>
                            <p className="text-xs text-gray-600">{propertyDetails?.propertyType || "Accommodation"}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs">★ {propertyDetails?.avgRating?.toFixed(2) || "New"}</span>
                              {propertyDetails?.reviewCount && propertyDetails.reviewCount > 0 && (
                                <span className="text-xs text-gray-600 ml-1">
                                  ({propertyDetails.reviewCount}{" "}
                                  {propertyDetails.reviewCount === 1 ? "review" : "reviews"})
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-medium mb-4">Price details</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>
                          {formatCurrency(nightlyRate)} x {totalNights} nights
                        </span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>

                      {bookingStore.discountPercentage && bookingStore.discountPercentage > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Early bird discount</span>
                          <span className="text-green-600">-{formatCurrency(discount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span>Taxes</span>
                        <span>{formatCurrency(taxes)}</span>
                      </div>

                      <div className="flex justify-between pt-4 border-t font-semibold text-sm">
                        <span>Total (USD)</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile price summary - shown only on mobile */}
        <div className="md:hidden mt-8">
          <Card className="shadow-lg border rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                {isLoadingProperty ? (
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                ) : (
                  <img
                    src={propertyDetails?.images?.[0] || "/placeholder.jpg"}
                    alt={propertyDetails?.title || "Property"}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  {isLoadingProperty ? (
                    <>
                      <div className="h-3 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xs">{propertyDetails?.title || "Property"}</h3>
                      <p className="text-xs text-gray-600">{propertyDetails?.propertyType || "Accommodation"}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs">★ {propertyDetails?.avgRating?.toFixed(2) || "New"}</span>
                        {propertyDetails?.reviewCount && propertyDetails.reviewCount > 0 && (
                          <span className="text-xs text-gray-600 ml-1">
                            ({propertyDetails.reviewCount} {propertyDetails.reviewCount === 1 ? "review" : "reviews"})
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-base font-medium mb-4">Price details</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>
                    {formatCurrency(nightlyRate)} x {totalNights} nights
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {bookingStore.discountPercentage && bookingStore.discountPercentage > 0 && (
                  <div className="flex justify-between">
                    <span>Early bird discount</span>
                    <span className="text-green-600">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>

                <div className="flex justify-between pt-4 border-t font-semibold">
                  <span>Total (USD)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

