import { getUserConversations } from "@/actions/messaging"
import MobileFooter from "@/components/frontend/mobile-footer"
import { EmptyState } from "@/components/messages/EmptyState"
import { MessageList } from "@/components/messages/MessageList"
import { MessageListSkeleton } from "@/components/messages/MessageListSkeleton"
import { Suspense } from "react"

export const metadata = {
  title: "Messages",
  description: "Chat with property hosts and guests",
}

export default async function MessagesPage() {
  const { data: conversations, success } = await getUserConversations()
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex">
        <div className="w-full md:w-1/3 border-r block lg:hidden">
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
          <Suspense fallback={<MessageListSkeleton />}>
            {success && conversations && conversations.length > 0 ? (
              <MessageList conversations={conversations} />
            ) : (
              <EmptyState
                title="No messages yet"
                description="When you book a property or contact a host, your conversations will appear here."
              />
            )}
          </Suspense>
        </div>
        <div className="hidden md:flex md:flex-1 items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
          </div>
        </div>
      </div>
      <MobileFooter/>
    </div>
  )
}