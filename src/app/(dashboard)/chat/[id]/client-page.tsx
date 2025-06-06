
'use client';
import React, { useState, useEffect } from 'react';
import ChatInterface from '../../../../components/ui/chat-interface'; // Corrected relative path
import { Loader2, AlertTriangle } from 'lucide-react';
import type { DisplayMessage, ChatConfig } from '../../../../types'; // Corrected relative path
import { toast } from 'sonner';

interface ClientChatPageProps {
  sessionId: string;
  userId: string;
  kidName: string;
  initialMessages: DisplayMessage[];
  chatConfig: ChatConfig;
}

export default function ClientChatPage({
  sessionId,
  userId,
  kidName,
  initialMessages,
  chatConfig,
}: ClientChatPageProps) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [keyError, setKeyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      setIsLoadingKey(true);
      setKeyError(null);
      try {
        const response = await fetch('/api/gemini');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch API key: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.apiKey) {
          setApiKey(data.apiKey);
        } else {
          throw new Error('API key not found in response.');
        }
      } catch (error) {
        console.error('Error fetching API key:', error);
        const errorMessage = (error as Error).message || 'Could not load API configuration.';
        setKeyError(errorMessage);
        toast.error(`API Key Error: ${errorMessage}`);
      } finally {
        setIsLoadingKey(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoadingKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading chat environment...</p>
      </div>
    );
  }

  if (keyError || !apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Chat Unavailable</h2>
        <p className="text-muted-foreground">
          {keyError || 'The API key could not be loaded, which is required for the chat.'}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
            Please ensure the GOOGLE_GEMINI_API_KEY is configured on the server.
        </p>
      </div>
    );
  }
  
  return (
    <ChatInterface
      sessionId={sessionId}
      userId={userId}
      kidName={kidName}
      initialMessagesFromProp={initialMessages}
      chatConfig={chatConfig}
      apiKey={apiKey}
    />
  );
}