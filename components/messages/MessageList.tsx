"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { format } from "date-fns"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MessageList({ conversations }: { conversations: any[] }) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = conversations.filter((conversation) => {
    // Handle case where there are no messages
    if (!conversation.messages || conversation.messages.length === 0) {
      return true // Include conversations without messages
    }

    // Get the other user (not the message sender)
    const otherUser = conversation.users.find(
      (user: any) => conversation.messages[0]?.sender && user.id !== conversation.messages[0].sender.id
    ) || conversation.users[0]; // Fallback to first user if can't determine
    
    return (
      otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages[0]?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages"
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => {
            // Get the other user safely
            let otherUser;
            if (conversation.messages && conversation.messages.length > 0 && conversation.messages[0]?.sender) {
              otherUser = conversation.users.find((user: any) => user.id !== conversation.messages[0].sender.id);
            } else {
              // If no messages or sender, default to first user
              otherUser = conversation.users[0];
            }

            const lastMessage = conversation.messages?.[0]
            const isActive = pathname === `/messages/${conversation.id}`

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={`flex items-center p-4 border-b hover:bg-gray-50 transition-colors ${
                  isActive ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative mr-3">
                  <Image
                    src={otherUser?.image || "/placeholder.svg?height=40&width=40"}
                    alt={otherUser?.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate text-sm">{otherUser?.name || "Unknown User"}</h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(lastMessage.createdAt), "h:mm a")}
                      </span>
                    )}
                  </div>
                  {lastMessage ? (
                    <p className="text-xs text-gray-600 truncate">
                      {lastMessage.sender?.id === otherUser?.id 
                        ? lastMessage.content 
                        : `You: ${lastMessage.content}`}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                  )}
                </div>
              </Link>
            )
          })
        ) : (
          <div className="p-4 text-center text-gray-500">No conversations found</div>
        )}
      </div>
    </div>
  )
}