import { handleStripeWebhook } from "@/actions/payments"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const result = await handleStripeWebhook(req)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

