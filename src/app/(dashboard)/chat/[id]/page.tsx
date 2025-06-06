
import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';     // Corrected relative path
import { prisma } from '../../../../lib/prisma';       // Corrected relative path
import { notFound, redirect } from 'next/navigation';
import ClientChatPage from './client-page';
import type { DisplayMessage, ChatConfig } from '../../../../types'; // Corrected relative path
import { FIXED_MODEL_NAME_CONST } from '../../../../lib/utils'; // Corrected relative path

interface ChatPageParams {
  params: { id: string }; // sessionId
}

async function getChatSessionData(sessionId: string, userId: string) {
  const chatSession = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      user: true, // To get kidName
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!chatSession) {
    return null;
  }
  // Ensure the session belongs to the logged-in user
  if (chatSession.userId !== userId) {
    return 'unauthorized';
  }
  return chatSession;
}


export default async function ChatPage({ params }: ChatPageParams) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect('/login');
  }

  const sessionId = params.id;
  const chatSessionData = await getChatSessionData(sessionId, session.user.id);

  if (!chatSessionData) {
    notFound();
  }
  if (chatSessionData === 'unauthorized') {
     // Or redirect to dashboard with an error
    return <div className="p-4 text-red-500">Access to this chat session is denied.</div>;
  }

  const { user: chatUser, messages: dbMessages, ...chatDetails } = chatSessionData;

  if (!chatUser.kidName) {
    // This case should ideally be prevented by UI flow on dashboard
    redirect('/dashboard?error=kid_name_missing');
  }

  const initialMessages: DisplayMessage[] = dbMessages.map(msg => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
    audioBase64: msg.audioBase64 || undefined,
    isInterim: false, // All persisted messages are final
    createdAt: msg.createdAt,
  }));

  const chatConfig: ChatConfig = {
    voiceName: chatDetails.voiceName,
    languageCode: chatDetails.languageCode,
    modelName: chatDetails.modelName || FIXED_MODEL_NAME_CONST,
  };
  
  // The API key is fetched client-side by ClientChatPage now.
  // const apiKey = process.env.GOOGLE_GEMINI_API_KEY || null;

  return (
    <ClientChatPage
      sessionId={sessionId}
      userId={session.user.id}
      kidName={chatUser.kidName}
      initialMessages={initialMessages}
      chatConfig={chatConfig}
    />
  );
}