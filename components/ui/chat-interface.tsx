
'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import VoiceChat from './voice-chat';
import { ScrollArea } from './scroll-area'; 
import { Avatar, AvatarFallback, AvatarImage } from './avatar'; 
import { Bot, User, AlertTriangle, Mic } from 'lucide-react';
import { cn } from '../../utils'; 
import { FIXED_MODEL_NAME_CONST, PROXY_SERVER_URL } from '../../constants'; 
import type { DisplayMessage, ChatConfig, LiveGeminiHistoryEntry } from '../../types'; 
import { toast } from 'sonner';

interface ChatInterfaceProps {
  sessionId: string;
  userId: string; 
  kidName: string;
  initialMessagesFromProp: DisplayMessage[];
  chatConfig: ChatConfig; 
  apiKey: string | null; 
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId, userId, kidName, initialMessagesFromProp, chatConfig, apiKey
}) => {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessagesFromProp);
  const interimUserTranscriptRef = React.useRef<DisplayMessage | null>(null);
  const interimAITranscriptRef = React.useRef<DisplayMessage | null>(null);
  
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const systemInstructions = useMemo(() => {
    return `You are WonderChat, a friendly, engaging, and supportive AI companion for a child named ${kidName}. Your primary goal is to help ${kidName} develop communication and social skills. Speak clearly and use age-appropriate language for a 5-10 year old. Be patient, encouraging, and ask open-ended questions. Keep your responses relatively concise (1-3 sentences typically). Do not discuss sensitive, scary, or inappropriate topics. Focus on positive themes like friendship, learning, creativity, and everyday experiences. Your voice persona is ${chatConfig.voiceName}. Respond in ${chatConfig.languageCode}.`;
  }, [kidName, chatConfig.voiceName, chatConfig.languageCode]);

  useEffect(() => {
    // Welcome message logic can be simplified if initialMessagesFromProp always includes it from server.
    // This is a fallback if client-side init is needed.
    if (messages.length === 0 && kidName && chatConfig.voiceName) {
      const welcomeMsg: DisplayMessage = {
        id: `assistant-welcome-${Date.now()}`,
        role: 'assistant',
        content: `Hi ${kidName}! I'm WonderChat, using my ${chatConfig.voiceName} voice. I'm excited to talk with you! What's on your mind today?`,
        createdAt: new Date(),
      };
      setMessages([welcomeMsg]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidName, chatConfig.voiceName]); 

  const saveMessageToDb = useCallback(async (messageToSave: Omit<DisplayMessage, 'id' | 'createdAt'>) => {
    console.log('Mock saving message for session:', sessionId, messageToSave);
    // In a real app, this would be an API call.
    // For SPA, this might involve updating a local store or sending to a mock backend.
    // Example:
    // try {
    //   const response = await fetch('/api/chat/message', { /* ... */ });
    //   // ... handle response
    // } catch (error) { /* ... handle error */ }
  }, [sessionId]);

  const handleMessageReceived = useCallback((message: Omit<DisplayMessage, 'id' | 'createdAt'>, isFinal: boolean) => {
    if (!isFinal) return; 

    const newMessage: DisplayMessage = {
      ...message,
      id: `${message.role}-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
      createdAt: new Date(),
      isInterim: false,
    };

    setMessages(prevMessages => {
      const filteredMessages = prevMessages.filter(m => !(m.isInterim && m.role === newMessage.role));
      return [...filteredMessages, newMessage];
    });

    if (message.role === 'user') interimUserTranscriptRef.current = null;
    if (message.role === 'assistant') interimAITranscriptRef.current = null;

    if (!newMessage.content.startsWith("Mock saving message")) { // Avoid saving mock logs
        saveMessageToDb(newMessage);
    }
  }, [saveMessageToDb]);

  const handleInterimTranscriptUpdate = useCallback((transcript: string, role: 'user' | 'assistant') => {
    const newInterimMessage: DisplayMessage = {
        id: `interim-${role}`, // Stable ID for interim message of a given role
        role,
        content: transcript,
        isInterim: true,
        createdAt: new Date(),
    };

    if (role === 'user') {
        interimUserTranscriptRef.current = newInterimMessage;
        if (interimAITranscriptRef.current) interimAITranscriptRef.current = null; 
    } else if (role === 'assistant') {
        interimAITranscriptRef.current = newInterimMessage;
        if (interimUserTranscriptRef.current) interimUserTranscriptRef.current = null;
    }

    setMessages(prevMessages => {
        let updatedMessages = prevMessages.filter(m => !m.isInterim); 
        if (interimUserTranscriptRef.current) {
            updatedMessages.push(interimUserTranscriptRef.current);
        }
        if (interimAITranscriptRef.current) {
            updatedMessages.push(interimAITranscriptRef.current);
        }
        return updatedMessages;
    });
  }, []);

  const geminiInitialHistory: LiveGeminiHistoryEntry[] = useMemo(() => {
    return messages
      .filter(msg => !msg.isInterim && msg.content) // Only final, non-empty messages
      .map((msg): LiveGeminiHistoryEntry => ({ 
        role: msg.role === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.content }],
      }))
      .slice(-10); // Limit context window for history
  }, [messages]);


  const displayedMessages = React.useMemo(() => {
    // This ensures that interim messages correctly replace previous interims of the same role.
    const finalMessages = messages.filter(m => !m.isInterim);
    const activeInterims = [];
    if (interimUserTranscriptRef.current?.content) { // Ensure content exists
        activeInterims.push(interimUserTranscriptRef.current);
    }
    if (interimAITranscriptRef.current?.content) { // Ensure content exists
        // If user is also speaking, user's interim usually takes precedence visually
        if (!interimUserTranscriptRef.current?.content) {
            activeInterims.push(interimAITranscriptRef.current);
        }
    }
    return [...finalMessages, ...activeInterims];
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-150px)] bg-card border rounded-lg shadow-xl">
       <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chatting with WonderChat as {kidName}</h2>
        <p className="text-xs text-muted-foreground">Voice: {chatConfig.voiceName} | Lang: {chatConfig.languageCode} | Model: {FIXED_MODEL_NAME_CONST.split('-').slice(0,2).join('-')}</p>
      </div>
      <ScrollArea className="flex-grow p-4 space-y-4" viewportRef={scrollAreaViewportRef}>
        {displayedMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex items-end space-x-2 max-w-[85%] sm:max-w-[75%]',
              msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
            )}
            aria-live={msg.isInterim ? 'polite' : 'off'}
            aria-atomic="true"
          >
            {msg.role === 'assistant' && (
              <Avatar className="h-8 w-8 self-start shrink-0"> 
                <AvatarImage src="https://picsum.photos/seed/aiBot/40/40" alt="AI Avatar" />
                <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'p-3 rounded-xl shadow-md', 
                msg.isInterim ? 'italic opacity-70 bg-opacity-80' : '', 
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100 rounded-bl-none' 
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'user' && msg.audioBase64 && !msg.isInterim && (
                <div className="mt-1 text-xs opacity-60 flex items-center">
                  <Mic className="h-3 w-3 mr-1" /> (Audio sent)
                </div>
              )}
               {msg.role === 'assistant' && msg.audioBase64 && !msg.isInterim && ( 
                <div className="mt-1 text-xs opacity-60 flex items-center">
                  <Mic className="h-3 w-3 mr-1" /> (Audio received)
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <Avatar className="h-8 w-8 self-start shrink-0"> 
                <AvatarImage src={`https://picsum.photos/seed/${userId || 'userAvatar'}/40/40`} alt="User Avatar" />
                <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>
      <VoiceChat
        apiKey={apiKey} 
        languageCode={chatConfig.languageCode}
        voiceName={chatConfig.voiceName}
        onMessageReceived={handleMessageReceived}
        onInterimTranscriptUpdate={handleInterimTranscriptUpdate}
        systemInstructions={systemInstructions}
        initialHistoryProp={geminiInitialHistory}
        kidName={kidName}
      />
    </div>
  );
};

export default ChatInterface;
