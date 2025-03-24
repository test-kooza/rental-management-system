import { NextResponse } from 'next/server';
import { sendMessage } from '@/actions/messaging';
import { getAuthenticatedUser2 } from '@/config/useAuth';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: Request) {
    try {
      const user = await getAuthenticatedUser2();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const { conversationId, content, optimisticId } = await req.json();
      
      if (!conversationId || !content) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      const { success, data, error } = await sendMessage(conversationId, content);
  
      if (!success) {
        return NextResponse.json({ error }, { status: 500 });
      }
  
      const messageWithOptimisticId = {
        ...data,
        optimisticId
      };
  
      await pusherServer.trigger(`conversation-${conversationId}`, 'new-message', messageWithOptimisticId);
  
      return NextResponse.json({ message: 'Message sent successfully', data: messageWithOptimisticId });
    } catch (error) {
      console.error('Error sending message:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }