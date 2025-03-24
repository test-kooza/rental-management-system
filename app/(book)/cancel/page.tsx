"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Card className="border-red-100 shadow-lg">
        <CardHeader className="text-center pb-2">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Booking Cancelled</CardTitle>
          <CardDescription className="text-lg">Your booking process was not completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-4">What Happened?</h3>
            <p className="text-muted-foreground">
              Your booking was not completed because the payment process was cancelled or interrupted. Don't worry - no
              charges have been made to your payment method.
            </p>
          </div>

          <div className="border-t border-b py-6">
            <h3 className="font-semibold text-lg mb-4">What Can You Do Now?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <ArrowLeft className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Try booking again</p>
                  <p className="text-muted-foreground text-sm">
                    Return to the property page and restart the booking process
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Explore other options</p>
                  <p className="text-muted-foreground text-sm">Browse other properties that might suit your needs</p>
                </div>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button className="w-full sm:w-auto" variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-[#FF385C] hover:bg-[#E31C5F] text-white"
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

