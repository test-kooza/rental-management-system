"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, MessageCircle, Home } from "lucide-react"
import Link from "next/link"
import { useBookingStore } from "@/store/use-booking"
import { processSuccessfulPayment, sendBookingConfirmationEmail } from "@/actions/payments"

export default function SuccessPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingNumber, setBookingNumber] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "error" | null>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const bookingStore = useBookingStore()
  const router = useRouter()
  const processingRef = useRef(false)

  useEffect(() => {
    if (processingRef.current) return;
    
    const processPayment = async () => {
      if (!sessionId) {
        setLoading(false)
        return
      }

      processingRef.current = true;

      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await processSuccessfulPayment(sessionId)
        
        if (result.success) {
          if (result.bookingNumber) {
            setBookingNumber(result.bookingNumber)
            bookingStore.reset()
      
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
            if (result.shouldSendEmail && result.bookingData && result.bookingData.guest.email) {
              setEmailStatus("sending");
              try {
                await sendBookingConfirmationEmail(
                  result.bookingData.guest.email, 
                  result.bookingData
                );
                setEmailStatus("sent");
            
              } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
                setEmailStatus("error");
               
              }
            }
          } else {
            setError("Booking confirmed but reference number is missing")
          }
        } else {
          setError(result.error || "Failed to process payment")
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        setError("Something went wrong. Please contact support.")
      } finally {
        setLoading(false)
      }
    }

    processPayment()
    
    return () => {
      processingRef.current = false;
    }
  }, [sessionId, bookingStore, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold text-center">Processing your booking...</h1>
        <p className="text-gray-500 text-center mt-2">Please wait while we confirm your payment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Payment Error</CardTitle>
            <CardDescription>There was a problem with your booking</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse" />
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your reservation has been successfully processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Booking Reference</p>
            <p className="font-medium">{bookingNumber}</p>
          </div>

          <p className="text-center text-gray-700 text-sm">
            {emailStatus === "sending" && "Sending confirmation email..."}
            {emailStatus === "sent" && "We've sent a confirmation email with all the details of your booking."}
            {emailStatus === "error" && "There was an issue sending your confirmation email, but your booking is confirmed."}
            {emailStatus === null && "Your booking details are available in your account dashboard."}
            {" You can also view your booking in your account dashboard."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/messages">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Host
            </Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}