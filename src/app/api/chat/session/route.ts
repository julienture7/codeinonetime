
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { FIXED_MODEL_NAME_CONST } from '@/lib/utils';

const createSessionSchema = z.object({
  voiceName: z.string().min(1),
  languageCode: z.string().min(1),
  // modelName is fixed for this flow, so not part of client input
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const parentUser = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (!parentUser || !parentUser.kidName) {
        return NextResponse.json({ message: "Kid's name not set. Please set it in the dashboard." }, { status: 400 });
    }

    const body = await req.json();
    const validation = createSessionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { voiceName, languageCode } = validation.data;

    const newChatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        voiceName,
        languageCode,
        modelName: FIXED_MODEL_NAME_CONST, // Use fixed model name from constants
        startedAt: new Date(),
        // Create an initial welcome message from the assistant
        messages: {
          create: {
            content: `Hi ${parentUser.kidName}! I'm WonderChat. Let's talk! What would you like to talk about today?`,
            role: 'assistant',
          }
        }
      },
    });

    return NextResponse.json({ success: true, sessionId: newChatSession.id });

  } catch (error) {
    console.error('Create chat session error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
