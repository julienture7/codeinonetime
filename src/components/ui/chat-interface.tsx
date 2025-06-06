'use client';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import VoiceChat from './voice-chat';
import { ScrollArea } from './scroll-area'; 
import { Avatar, AvatarFallback, AvatarImage } from './avatar'; 
import { Bot, User, AlertTriangle, Mic } from 'lucide-react';
import { cn, FIXED_MODEL_NAME_CONST } from '../../lib/utils';
import type { DisplayMessage, ChatConfig, LiveGeminiHistoryEntry } from '../types'; // Corrected import path
import { toast } from 'sonner';

// Fallback for ScrollArea if not generated/available
const FallbackScrollArea: React.FC<{className?: string; children: React.ReactNode; viewportRef?: React.RefObject<HTMLDivElement>}> = ({ className, children, viewportRef }) => (
  <div ref={viewportRef} className={cn("overflow-y-auto h-full", className)}>{children}</div>
);
const FallbackAvatar: React.FC<{className?: string; children: React.ReactNode;}> = ({ className, children }) => <div className={cn("rounded-full bg-muted", className)}>{children}</div>;
const FallbackAvatarImage: React.FC<{src?: string; alt?: string;}> = ({src, alt}) => src ? <img src={src} alt={alt || 'avatar'} className="w-full h-full object-cover rounded-full" /> : null;
const FallbackAvatarFallback: React.FC<{children: React.ReactNode;}> = ({ children}) => <div className="flex items-center justify-center w-full h-full">{children}</div>;


interface ChatInterfaceProps {
  sessionId: string;
  userId: string; // Parent's User ID
  kidName: string;
  initialMessagesFromProp: DisplayMessage[];
  chatConfig: ChatConfig; // voiceName, languageCode, modelName
  apiKey: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId, userId, kidName, initialMessagesFromProp, chatConfig, apiKey
}) => {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessagesFromProp);
  const interimUserTranscriptRef = React.useRef<DisplayMessage | null>(null);
  const interimAITranscriptRef = React.useRef<DisplayMessage | null>(null);
  
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

  const ScrollAreaComp = ScrollArea || FallbackScrollArea;
  const AvatarComp = Avatar || FallbackAvatar;
  const AvatarImageComp = AvatarImage || FallbackAvatarImage;
  const AvatarFallbackComp = AvatarFallback || FallbackAvatarFallback;


  const scrollToBottom = useCallback(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const systemInstructions = useMemo(() => {
    return `You are WonderChat, a friendly, engaging, and supportive AI companion for a child named ${kidName}. Your primary goal is to help ${kidName} develop communication and social skills. Speak clearly and use age-appropriate language for a ${Math.floor(Math.random() * 5) + 5}-10 year old. Be patient, encouraging, and ask open-ended questions. Keep your responses relatively concise. Do not discuss sensitive, scary, or inappropriate topics. Focus on positive themes like friendship, learning, creativity, and everyday experiences. Your voice persona is ${chatConfig.voiceName}.`;
  }, [kidName, chatConfig.voiceName]);

  useEffect(() => {
    if (messages.length === 0 && kidName) {
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

  const saveMessageToDb = useCallback(async (message: Omit<DisplayMessage, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          content: message.content,
          role: message.role,
          audioBase64: message.audioBase64,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save message: ${errorData.message || 'Unknown error'}`);
        console.error('Failed to save message:', errorData);
      }
    } catch (error) {
      toast.error('Error saving message to database.');
      console.error('Error saving message:', error);
    }
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

    saveMessageToDb(newMessage);
  }, [saveMessageToDb]);

  const handleInterimTranscriptUpdate = useCallback((transcript: string, role: 'user' | 'assistant') => {
    const newInterimMessage: DisplayMessage = {
        id: `interim-${role}-${Date.now()}`, 
        role,
        content: transcript,
        isInterim: true,
        createdAt: new Date(),
    };

    if (role === 'user') {
        interimUserTranscriptRef.current = newInterimMessage;
        if (interimAITranscriptRef.current) interimAITranscriptRef.current = null; 
    }
    if (role === 'assistant') {
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
      .filter(msg => !msg.isInterim) 
      .map((msg): LiveGeminiHistoryEntry => ({ 
        role: msg.role === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.content }],
      }))
      .slice(-10); 
  }, [messages]);

  const PROXY_SERVER_URL_CONST = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_WEBSOCKET_PROXY_URL) || (window as any).WEBSOCKET_PROXY_URL || 'ws://localhost:3001';


  if (!apiKey && PROXY_SERVER_URL_CONST === 'ws://localhost:3001') {
    console.warn("ChatInterface: API key is not provided, and WebSocket proxy might be using default. Ensure configuration is correct.");
  }

  const displayedMessages = React.useMemo(() => {
    const finalMessages = messages.filter(m => !m.isInterim);
    const activeInterims = [];
    if (interimUserTranscriptRef.current) {
        activeInterims.push(interimUserTranscriptRef.current);
    } else if (interimAITranscriptRef.current) { 
        activeInterims.push(interimAITranscriptRef.current);
    }
    return [...finalMessages, ...activeInterims];
  }, [messages]);


  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-150px)] bg-card border rounded-lg shadow-xl">
       <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Chatting with WonderChat as {kidName}</h2>
        <p className="text-xs text-muted-foreground">Voice: {chatConfig.voiceName} | Language: {chatConfig.languageCode} | Model: {FIXED_MODEL_NAME_CONST.split('-').slice(0,2).join('-')}</p>
      </div>
      <ScrollAreaComp className="flex-grow p-4 space-y-4" viewportRef={scrollAreaViewportRef}>
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
              <AvatarComp className="h-8 w-8 self-start shrink-0"> 
                <AvatarImageComp src="https://picsum.photos/seed/aiBot/40/40" alt="AI Avatar" />
                <AvatarFallbackComp><Bot className="h-5 w-5"/></AvatarFallbackComp>
              </AvatarComp>
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
              <AvatarComp className="h-8 w-8 self-start shrink-0"> 
                <AvatarImageComp src={`https://picsum.photos/seed/${userId || 'userAvatar'}/40/40`} alt="User Avatar" />
                <AvatarFallbackComp><User className="h-5 w-5"/></AvatarFallbackComp>
              </AvatarComp>
            )}
          </div>
        ))}
      </ScrollAreaComp>
      <VoiceChat
        apiKey={apiKey} 
        languageCode={chatConfig.languageCode}
        voiceName={chatConfig.voiceName}
        // modelName={chatConfig.modelName} // Model name is fixed in LiveGeminiClient
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