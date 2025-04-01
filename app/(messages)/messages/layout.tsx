import type React from "react"
import { Suspense } from "react"
import { getUserConversations } from "@/actions/messaging"
import { MessageListSkeleton } from "@/components/messages/MessageListSkeleton"
import { EmptyState } from "@/components/messages/EmptyState"
import { MessageList } from "@/components/messages/MessageList"
import PropertyHeader from "@/components/frontend/property-header"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config/auth"

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode 
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?returnUrl=/dashboard");
  }
  const { data: conversations, success } = await getUserConversations()
  
  return (
    <div>
        <PropertyHeader session={session} />
        <div className="flex h-[calc(100vh-4rem)]">

<div className="hidden lg:block">
  <Suspense fallback={<MessageListSkeleton />}>
    {success && conversations ? (
      <MessageList conversations={conversations} />
    ) : (
      <MessageListSkeleton />
    )}
  </Suspense>
</div>

{success && conversations && conversations.length > 0 ? (
  <main className="flex-1 overflow-hidden w-full">{children}</main>
) : (
  <EmptyState
    title="No messages yet"
    description="When you book a property or contact a host, your conversations will appear here."
  />
)}
</div>
    </div>
  
  )
}

