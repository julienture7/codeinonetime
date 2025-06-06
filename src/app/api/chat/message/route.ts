
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const saveMessageSchema = z.object({
  sessionId: z.string().cuid(),
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  audioBase64: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = saveMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { sessionId, content, role, audioBase64 } = validation.data;

    // Verify session ownership
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
    });

    if (!chatSession || chatSession.userId !== session.user.id) {
      return NextResponse.json({ message: 'Session not found or access denied' }, { status: 404 });
    }

    const savedMessage = await prisma.chatMessage.create({
      data: {
        sessionId,
        content,
        role,
        audioBase64: audioBase64 || undefined, // Store if provided
      },
    });

    return NextResponse.json({ success: true, messageId: savedMessage.id });

  } catch (error) {
    console.error('Save chat message error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
