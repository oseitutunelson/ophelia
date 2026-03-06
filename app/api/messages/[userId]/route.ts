import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const recipientId = params.userId;

    if (userId === recipientId) {
      return NextResponse.json(
        { success: false, message: "You can't message yourself" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Find existing conversation between these users
    let conversation = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { has: userId } },
          { participants: { has: recipientId } }
        ]
      }
    });

    // Create conversation if it doesn't exist
    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          participants: [userId, recipientId]
        }
      });
    }

    // Create message
    const newMessage = await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        content: message.trim()
      }
    });

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
      conversationId: conversation.id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send message' },
      { status: 500 }
    );
  }
}