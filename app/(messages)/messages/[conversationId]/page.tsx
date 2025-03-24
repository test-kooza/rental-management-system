import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getConversation } from "@/actions/messaging"
import { ChatSkeleton } from "@/components/messages/ChatSkeleton"
import { ChatContainer } from "@/components/messages/ChatContainer"
import { ReservationDetails } from "@/components/messages/ReservationDetails"
import { getAuthenticatedUser2 } from "@/config/useAuth"

export const metadata = {
  title: "Chat",
  description: "Chat with property hosts and guests",
}

export default async function page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const conversationId = (await params).conversationId;
  const { data: conversation, success, error } = await getConversation(conversationId)

  if (!success || !conversation) {
    notFound()
  }

  const currentUser = await getAuthenticatedUser2();
  
  const otherUser = conversation.users.find((user: any) => user.id !== currentUser.id);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Suspense fallback={<ChatSkeleton />}>
        <ChatContainer conversation={conversation} otherUser={otherUser} />
      </Suspense>

      {conversation.bookings && conversation.bookings.length > 0 && (
        <div className="hidden lg:block lg:w-[50%] border-l">
          <ReservationDetails booking={conversation.bookings[0]} />
        </div>
      )}
    </div>
  )
}