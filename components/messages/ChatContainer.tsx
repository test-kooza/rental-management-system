"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { pusherClient } from "@/lib/pusher"
import toast from "react-hot-toast"

interface ChatContainerProps {
  conversation: any
  otherUser: any
}

export function ChatContainer({ conversation, otherUser }: ChatContainerProps) {
  const router = useRouter()
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(conversation.messages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const api = process.env.NEXT_PUBLIC_APP_URL

  useEffect(() => {
    const channelName = `conversation-${conversation.id}`
    const channel = pusherClient.subscribe(channelName)

    channel.bind("new-message", (data: any) => {
      setMessages((prevMessages: any[]) => {
        if (prevMessages.some((m) => m.id === data.id)) return prevMessages
        return [...prevMessages, data]
      })
    })

    return () => {
      pusherClient.unsubscribe(channelName)
    }
  }, [conversation.id, messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      setIsSubmitting(true)

      const timestamp = Date.now()
      const currentUser = conversation.users.find((u: any) => u.id !== otherUser.id)

      const optimisticMessage = {
        id: `temp-${timestamp}`,
        content: newMessage,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUser?.id,
          name: currentUser?.name || "You",
          image: currentUser?.image || null,
        },
        isOptimistic: true,
        optimisticId: timestamp,
      }

      setMessages((prevMessages: any[]) => [...prevMessages, optimisticMessage])

      setNewMessage("")

      const response = await fetch(`${api}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: newMessage,
          optimisticId: timestamp,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")

      setMessages((prevMessages: any[]) => prevMessages.filter((msg) => !msg.isOptimistic))

      setNewMessage(newMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {/* Chat header */}
      <div className="flex items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
      <Button variant="outline" className="md:hidden flex" size="icon" onClick={() => router.back()} aria-label="Go back">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center">
        <Image
          src={otherUser?.image || "/placeholder.jpg"}
          alt={otherUser?.name || "User"}
          width={35}
          height={35}
          className="rounded-full object-cover mr-3"
        />
        <div>
          <h2 className="font-medium text-sm">{otherUser?.name}</h2>
          {conversation.bookings && conversation.bookings.length > 0 && (
            <Link
              href={`/properties/${conversation.bookings[0].property.slug}`}
              className="text-xs text-primary hover:underline"
            >
              {conversation.bookings[0].property.title}
            </Link>
          )}
        </div>
      </div>
    </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => {
          const isCurrentUser = message.sender.id !== otherUser?.id

          if (
            message.isOptimistic &&
            messages.some((m: any) => !m.isOptimistic && m.optimisticId === message.optimisticId)
          ) {
            return null
          }

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[75%]">
                {!isCurrentUser && (
                  <Image
                    src={message.sender.image || "/placeholder.jpg"}
                    alt={message.sender.name}
                    width={23}
                    height={23}
                    className="rounded-full object-cover mb-1"
                  />
                )}

                <div
                  className={`rounded-lg p-3 ${
                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  } ${message.isOptimistic ? "opacity-70" : ""}`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {format(new Date(message.createdAt), "h:mm a")}
                    {message.isOptimistic && " (sending...)"}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Type a message..."
            className="resize-none min-h-[80px] focus-visible:ring-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={isSubmitting || !newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

