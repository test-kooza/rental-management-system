"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/prisma/db"
import { getAuthenticatedUser2 } from "@/config/useAuth"

function serializeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'object') {
    if (typeof data.toNumber === 'function') {
      return data.toNumber();
    }
    
    if (data instanceof Date) {
      return data;
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => serializeData(item));
    }
    
    // Handle plain objects
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializeData(data[key]);
      }
    }
    return serialized;
  }
  
  return data;
}

export async function getOrCreateConversation(hostId: string, propertyId?: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if conversation already exists
    const existingConversation = await db.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [user.id, hostId],
            },
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        bookings: {
          include: {
            property: true,
          },
        },
      },
    })

    if (existingConversation) {
      return { success: true, data: serializeData(existingConversation) }
    }

    // Create new conversation
    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [{ id: user.id }, { id: hostId }],
        },
        ...(propertyId && {
          bookings: {
            connect: {
              id: propertyId,
            },
          },
        }),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        bookings: {
          include: {
            property: true,
          },
        },
      },
    })

    revalidatePath("/messages")

    return { success: true, data: serializeData(newConversation) }
  } catch (error) {
    console.error("Error creating conversation:", error)
    return { success: false, error: "Failed to create conversation" }
  }
}

// Get all conversations for the current user
export async function getUserConversations() {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const conversations = await db.conversation.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        bookings: {
          include: {
            property: {
              select: {
                id: true,
                title: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return { success: true, data: serializeData(conversations) }
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return { success: false, error: "Failed to fetch conversations" }
  }
}

// Get a single conversation by ID
export async function getConversation(conversationId: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        bookings: {
          include: {
            property: true,
          },
        },
      },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // Mark all unread messages as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: {
          not: user.id,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return { success: true, data: serializeData(conversation) }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return { success: false, error: "Failed to fetch conversation" }
  }
}

// Send a message
// export async function sendMessage(conversationId: string, content: string) {
//   try {
//     const user = await getAuthenticatedUser2()

//     if (!user) {
//       return { success: false, error: "Authentication required" }
//     }

//     const message = await db.message.create({
//       data: {
//         conversationId,
//         senderId: user.id,
//         content,
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             name: true,
//             image: true,
//           },
//         },
//       },
//     })

//     // Update conversation's updatedAt
//     await db.conversation.update({
//       where: { id: conversationId },
//       data: { updatedAt: new Date() },
//     })

//     revalidatePath("/messages")
//     revalidatePath(`/messages/${conversationId}`)

//     return { success: true, data: serializeData(message) }
//   } catch (error) {
//     console.error("Error sending message:", error)
//     return { success: false, error: "Failed to send message" }
//   }
// }

// Start a new conversation with a property host
export async function startConversationWithHost(hostId: string, propertyId: string, initialMessage: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if conversation already exists
    const existingConversation = await db.conversation.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [user.id, hostId],
            },
          },
        },
      },
    })

    let conversationId: string

    if (existingConversation) {
      conversationId = existingConversation.id
    } else {
      // Create new conversation
      const newConversation = await db.conversation.create({
        data: {
          users: {
            connect: [{ id: user.id }, { id: hostId }],
          },
        },
      })

      conversationId = newConversation.id
    }

    // Send initial message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: initialMessage,
      },
    })

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    revalidatePath("/messages")

    return { success: true, data: serializeData({ conversationId, message }) }
  } catch (error) {
    console.error("Error starting conversation:", error)
    return { success: false, error: "Failed to start conversation" }
  }
}


export async function sendMessage(conversationId: string, content: string) {
  try {
    const user = await getAuthenticatedUser2()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update conversation's updatedAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    // Publish the new message to SSE subscribers

    revalidatePath("/messages")
    revalidatePath(`/messages/${conversationId}`)

    return { success: true, data: serializeData(message) }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}