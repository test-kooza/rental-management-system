"use server"

import { Resend } from "resend"
import { z } from "zod"
import { format } from "date-fns"
import { getAuthenticatedUser } from "@/config/useAuth"
import { checkPropertyAvailability } from "./property-detailed"
import { stripe } from "@/lib/strip"
import { db } from "@/prisma/db"
import BookingConfirmationEmail from "@/components/email-templates/booking-confirming"

const resend = new Resend(process.env.RESEND_API_KEY)

const bookingFormSchema = z.object({
  streetAddress: z.string().min(1, { message: "Street address is required" }),
  aptSuite: z.string().optional(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZIP code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  phoneNumber: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

export async function createStripeCheckoutSession(formData: BookingFormData, bookingData: any) {
  try {
    // Validate form data
    const validatedData = bookingFormSchema.parse(formData)

    // Get authenticated user
    const user = await getAuthenticatedUser()

    if (!user || !user.id) {
      return { success: false, error: "User not authenticated" }
    }

    // Check property availability
    const availabilityCheck = await checkPropertyAvailability(
      bookingData.propertyId,
      bookingData.checkInDate.toISOString(),
      bookingData.checkOutDate.toISOString(),
    )

    if (!availabilityCheck.available) {
      return { success: false, error: availabilityCheck.reason }
    }

    // Generate a unique booking number
    const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`

    // Calculate the amount in cents for Stripe
    const amountInCents = Math.round(bookingData.totalPrice * 100)

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking: ${bookingData.property.name}`,
              description: `${bookingData.totalNights} nights (${format(bookingData.checkInDate, "MMM dd, yyyy")} - ${format(bookingData.checkOutDate, "MMM dd, yyyy")})`,
              images: [bookingData.property.image],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        bookingNumber,
        propertyId: bookingData.propertyId,
        guestId: user.id,
        checkInDate: bookingData.checkInDate.toISOString(),
        checkOutDate: bookingData.checkOutDate.toISOString(),
        adults: bookingData.adults.toString(),
        children: bookingData.children.toString(),
        infants: bookingData.infants.toString(),
        totalNights: bookingData.totalNights.toString(),
        basePrice: bookingData.basePrice.toString(),
        totalPrice: bookingData.totalPrice.toString(),
        discountPercentage: bookingData.discountPercentage?.toString() || "0",
        billingDetails: JSON.stringify({
          streetAddress: validatedData.streetAddress,
          aptSuite: validatedData.aptSuite,
          city: validatedData.city,
          state: validatedData.state,
          zipCode: validatedData.zipCode,
          country: validatedData.country,
          phoneNumber: validatedData.phoneNumber,
        }),
      },
    })

    // Create a pending booking in the database
    await db.booking.create({
      data: {
        bookingNumber,
        guestId: user.id,
        propertyId: bookingData.propertyId,
        status: "PENDING",
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        adults: bookingData.adults,
        children: bookingData.children,
        infants: bookingData.infants,
        basePrice: bookingData.basePrice,
        totalAmount: bookingData.totalPrice,
        currency: "USD",
        guestNote: `Phone: ${validatedData.phoneNumber || "Not provided"}`,
        stripePaymentId: session.id,
      },
    })

    return { success: true, sessionUrl: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}

export async function processSuccessfulPayment(sessionId: string) {
    try {
      const existingBooking = await db.booking.findFirst({
        where: {
          stripePaymentId: sessionId,
          status: "CONFIRMED"
        }
      });
  
      if (existingBooking) {
        return { 
          success: true, 
          bookingId: existingBooking.id, 
          bookingNumber: existingBooking.bookingNumber,
          shouldSendEmail: false // Already confirmed, no need to send email
        };
      }
  
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      if (session.payment_status !== "paid") {
        return { success: false, error: "Payment not completed" };
      }
  
      const bookingNumber = session.metadata?.bookingNumber;
      const propertyId = session.metadata?.propertyId;
      const guestId = session.metadata?.guestId;
  
      if (!bookingNumber || !propertyId || !guestId) {
        return { success: false, error: "Missing booking information" };
      }
        
      const booking = await db.booking.findFirst({
        where: { bookingNumber },
        include: {
          property: {
            include: {
              host: true,
            },
          },
          guest: true,
        },
      });
  
      if (!booking) {
        return { success: false, error: "Booking not found" };
      }
  
      if (booking.status === "CONFIRMED") {
        return { 
          success: true, 
          bookingId: booking.id, 
          bookingNumber,
          shouldSendEmail: false // Already confirmed, no need to send email
        };
      }
  
      // Update the booking status
      const updatedBooking = await db.booking.update({
        where: { id: booking.id },
        data: {
          status: "CONFIRMED",
          stripePaymentId: session.payment_intent as string,
        },
        include: {
          property: {
            include: {
              host: true,
            },
          },
          guest: true,
        },
      });
  
      console.log(`Updated booking status to CONFIRMED for booking ${bookingNumber}`);
  
      // Create a conversation between guest and host if it doesn't exist
      let conversation = await db.conversation.findFirst({
        where: {
          users: {
            some: {
              id: guestId,
            },
          },
          AND: {
            users: {
              some: {
                id: booking.property.hostId,
              },
            },
          },
        },
      });
  
      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            users: {
              connect: [{ id: guestId }, { id: booking.property.hostId }],
            },
          },
        });
        console.log(`Created new conversation for booking ${bookingNumber}`);
      } else {
        console.log(`Using existing conversation for booking ${bookingNumber}`);
      }
  
      // Update the booking with the conversation
      await db.booking.update({
        where: { id: booking.id },
        data: {
          conversation: {
            connect: {
              id: conversation.id,
            },
          },
        },
      });
  
      // Create notifications
      try {
        // For the host
        await db.notification.create({
          data: {
            type: "BOOKING_CONFIRMED",
            title: "New Booking Confirmed",
            message: `You have a new booking (${bookingNumber}) for ${booking.property.title}`,
            hostId: booking.property.hostId,
            entityId: booking.id,
          },
        });
  
        // For the guest
        await db.notification.create({
          data: {
            type: "BOOKING_CONFIRMED",
            title: "Booking Confirmed",
            message: `Your booking (${bookingNumber}) for ${booking.property.title} has been confirmed`,
            guestId: booking.guestId,
            entityId: booking.id,
          },
        });
      } catch (notificationError) {
        console.error("Error creating notifications:", notificationError);
      }
  
      return { 
        success: true, 
        bookingId: booking.id, 
        bookingNumber,
        shouldSendEmail: true, // New flag to indicate email should be sent
        bookingData: updatedBooking // Pass the booking data for email
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      return { 
        success: false, 
        error: "Failed to process payment: " + (error instanceof Error ? error.message : String(error)) 
      };
    }
  }
  
  export async function sendBookingConfirmationEmail(email: string, booking: any) {
    try {
      if (!process.env.RESEND_API_KEY) {
        return { success: false, error: "Email service not configured" };
      }
  
      if (!booking || !booking.bookingNumber) {
        return { success: false, error: "Invalid booking data" };
      }
  
      const serializedBooking = {
        ...booking,
        id: booking.id || "unknown",
        bookingNumber: booking.bookingNumber || "unknown",
        totalAmount: (booking.totalAmount?.toString() || "0"),
        basePrice: (booking.basePrice?.toString() || "0"),
        checkInDate: booking.checkInDate instanceof Date ? 
          booking.checkInDate.toISOString() : 
          (typeof booking.checkInDate === 'string' ? booking.checkInDate : new Date().toISOString()),
        checkOutDate: booking.checkOutDate instanceof Date ? 
          booking.checkOutDate.toISOString() : 
          (typeof booking.checkOutDate === 'string' ? booking.checkOutDate : new Date().toISOString()),
        property: booking.property || { title: "Property" },
        guest: booking.guest || { name: "Guest" }
      };
  
      const response = await resend.emails.send({
        from: "Bookings <orders@rwoma.com>",
        to: [email],
        subject: `Booking Confirmation #${serializedBooking.bookingNumber}`,
        react: BookingConfirmationEmail({ booking: serializedBooking }),
      });
  
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: "Failed to send confirmation email: " + (error instanceof Error ? error.message : String(error)) 
      };
    }
  }

export async function handleStripeWebhook(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      await processSuccessfulPayment(session.id)
    }

    return { received: true }
  } catch (error) {
    throw new Error(`Webhook Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getBookingById(bookingId: string) {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        property: true,
        guest: true,
      },
    })

    return booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}

export async function getBookingByNumber(bookingNumber: string) {
  try {
    const booking = await db.booking.findFirst({
      where: { bookingNumber },
      include: {
        property: true,
        guest: true,
      },
    })

    return booking
  } catch (error) {
    console.error("Error fetching booking:", error)
    return null
  }
}

