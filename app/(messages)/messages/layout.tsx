import type React from "react"
import { Suspense } from "react"
import { getUserConversations } from "@/actions/messaging"
import { MessageListSkeleton } from "@/components/messages/MessageListSkeleton"
import { EmptyState } from "@/components/messages/EmptyState"
import { MessageList } from "@/components/messages/MessageList"

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: conversations, success } = await getUserConversations()

  return (
    <div>
      <div className="flex h-[calc(100vh-4rem)]">
       <div className="hidden lg:block ">
       <Suspense fallback={<MessageListSkeleton />}>
              <MessageList conversations={conversations} />
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

