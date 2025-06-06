
import * as React from 'react';
import ChatInterface from './ui/chat-interface'; // Adjusted path
import { Loader2, AlertTriangle } from 'lucide-react';
import type { DisplayMessage, ChatConfig } from '../types'; // Adjusted path
import { toast } from 'sonner';
import { PROXY_SERVER_URL } from '../constants';

interface ChatPageProps {
  sessionId: string;
  userId: string;
  kidName: string;
  initialMessages: DisplayMessage[];
  chatConfig: ChatConfig;
}

export default function ChatPage({
  sessionId,
  userId,
  kidName,
  initialMessages,
  chatConfig,
}: ChatPageProps) {
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Simulate readiness or perform actual checks if needed (e.g., proxy server status if an endpoint was available)
    const timer = setTimeout(() => {
      if (!PROXY_SERVER_URL) {
        setError("WebSocket proxy server URL is not configured.");
        toast.error("Chat service is not configured correctly.");
      } else {
        console.log("ChatPage attempting to use WebSocket proxy at:", PROXY_SERVER_URL);
      }
      setIsReady(true);
    }, 300); // Short delay to allow any initial setup/checks

    return () => clearTimeout(timer);
  }, []);

  if (!isReady && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Initializing chat environment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Chat Unavailable</h2>
        <p className="text-muted-foreground">{error}</p>
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
      // The API key is handled by the proxy server.
      // Pass a nominal non-empty string as LiveGeminiClient expects an apiKey prop.
      // This key is not used by LiveGeminiClient for connecting to the *proxy*.
      apiKey={"PROXY_AUTH_IS_USED"} 
    />
  );
}
