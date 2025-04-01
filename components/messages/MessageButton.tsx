"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { startConversationWithHost } from "@/actions/messaging"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

interface MessageButtonProps {
  hostId: string
  propertyId: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function MessageButton({
  hostId,
  propertyId,
  size = "sm",
  className = "",
}: MessageButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession();
  
  const user = session?.user;
  
  const handleClick = async () => {
    if (!user) {
      router.push(`/login?returnUrl=/`);
      return;
    }
  
    try {
      setIsLoading(true);
  
      const result = await startConversationWithHost(hostId, propertyId, "Hi, I'm interested in your property.");
  
      if (result.success && result.data) {
        router.push(`/messages/${result.data.conversationId}`);
      } else {
        // If the API request fails, handle it gracefully
        toast.error(result.error || "Failed to start conversation");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Button size={size} className={`gap-1 bg-primary ${className}`} onClick={handleClick} disabled={isLoading}>
      <MessageSquare className="h-3.5 w-3.5 animate-pulse" />
      <span>Message Host</span>
    </Button>
  )
}

