"use client"

import { format } from "date-fns"
import { CreditCard, Calendar, ArrowRight, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useUpcomingPayouts } from "@/hooks/useFinancial"

export default function UpcomingPayouts() {
  const { payouts, isLoading } = useUpcomingPayouts()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payouts</CardTitle>
          <CardDescription>Loading payout data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payouts</CardTitle>
        <CardDescription>Scheduled payments to your account</CardDescription>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No upcoming payouts</h3>
            <p className="text-sm text-muted-foreground mt-1">You don't have any scheduled payouts at the moment.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex flex-col p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="font-medium">{payout.formattedAmount}</span>
                    </div>
                    <PayoutStatusBadge status={payout.status} />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    <div className="flex items-center gap-1">
                      <span>{format(new Date(payout.periodStart), "MMM d, yyyy")}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{format(new Date(payout.periodEnd), "MMM d, yyyy")}</span>
                    </div>
                  </div>

                  <div className="text-sm">{payout.description}</div>

                  {payout.status === "PENDING" && (
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

function PayoutStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          <span>Completed</span>
        </Badge>
      )
    case "PENDING":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Pending</span>
        </Badge>
      )
    case "FAILED":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <span>Failed</span>
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

