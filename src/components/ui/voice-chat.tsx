'use client';
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import LiveGeminiClient, { LiveGeminiClientHandles, LiveGeminiClientStatus } from '../../lib/live-gemini';
import { Button, type ButtonProps } from './button'; // Ensure ButtonProps for casting if needed
import { Input } from './input';
import { Mic, MicOff, Send, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DisplayMessage, LiveGeminiHistoryEntry } from '../types'; // Corrected import path


interface VoiceChatProps {
  apiKey: string | null; 
  languageCode: string;
  voiceName: string; 
  // modelName: string; // modelName is now fixed in LiveGeminiClient
  
  onMessageReceived: (message: Omit<DisplayMessage, 'id' | 'createdAt'>, isFinal: boolean) => void;
  onInterimTranscriptUpdate: (transcript: string, role: 'user' | 'assistant') => void;

  systemInstructions?: string;
  initialHistoryProp?: LiveGeminiHistoryEntry[]; 

  kidName: string; 
}

const VoiceChat: React.FC<VoiceChatProps> = React.memo(({
  apiKey, languageCode, voiceName, /* modelName, */ // modelName removed
  onMessageReceived, onInterimTranscriptUpdate,
  systemInstructions, initialHistoryProp, kidName,
}) => {
  const liveGeminiClientRef = useRef<LiveGeminiClientHandles>(null);
  const [clientStatus, setClientStatus] = useState<LiveGeminiClientStatus>('disconnected');
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false); 
  const [textInput, setTextInput] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);

  const clientStatusRef = React.useRef(clientStatus);
  React.useEffect(() => {
    clientStatusRef.current = clientStatus;
  }, [clientStatus]);

  const initialHistory = useMemo(() => initialHistoryProp, [initialHistoryProp]);

  const handleLGCStatusChange = useCallback((status: LiveGeminiClientStatus) => {
    setClientStatus(status);
    if (status !== 'error') { 
        setLastError(null); 
    }
    if(status === 'listening' && isMicrophoneActive){
        toast.success(`Listening, ${kidName}...`, { id: 'listening-toast', duration: 3000 });
    } else if (status === 'processing' && isMicrophoneActive) {
        toast.loading('WonderChat is thinking...', { id: 'processing-toast', duration: 15000 });
    } else if (status === 'speaking') {
        toast.dismiss('listening-toast');
        toast.dismiss('processing-toast');
    } else if (status === 'connected') { 
        toast.dismiss('listening-toast');
        toast.dismiss('processing-toast');
        toast.dismiss('speaking-toast'); 
    }
  }, [isMicrophoneActive, kidName]);

  const handleLGCError = useCallback((error: string) => {
    setLastError(error);
    setClientStatus('error'); 
    toast.error(`Chat Error: ${error}`, { duration: 10000 });
    if (error.toLowerCase().includes("websocket") || error.toLowerCase().includes("microphone access")) {
        setIsMicrophoneActive(false);
        if (liveGeminiClientRef.current?.isStreamingAudio()) {
            liveGeminiClientRef.current?.stopAudioStream();
        }
    }
  }, []);

  const handleLGCTranscriptUpdate = useCallback((transcript: string, isFinal: boolean) => {
    onInterimTranscriptUpdate(transcript, 'user'); 
  }, [onInterimTranscriptUpdate]);

  const handleLGCAIMessage = useCallback((text: string, audioBase64?: string, isFinal?: boolean) => {
    if (isFinal) {
        onMessageReceived({ role: 'assistant', content: text, audioBase64: audioBase64 }, true);
    } else {
        onInterimTranscriptUpdate(text, 'assistant');
    }
  }, [onMessageReceived, onInterimTranscriptUpdate]);


  useEffect(() => {
    if (apiKey && clientStatus === 'disconnected') {
      liveGeminiClientRef.current?.connect();
    }
    
    return () => {
      liveGeminiClientRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]); 

  const toggleMicrophone = () => {
    if (!liveGeminiClientRef.current || !apiKey) { 
        if (!apiKey) toast.error("Chat service not available: Configuration missing.");
        return;
    }
    
    if (clientStatus === 'disconnected' || clientStatus === 'error') {
        liveGeminiClientRef.current.connect(); 
        setTimeout(() => { 
          const currentActualStatus = clientStatusRef.current; 
          if (liveGeminiClientRef.current && currentActualStatus !== 'error' && currentActualStatus !== 'connecting') { 
             liveGeminiClientRef.current.startAudioStream();
             setIsMicrophoneActive(true);
          } else if (currentActualStatus === 'error' || currentActualStatus === 'connecting') {
            setIsMicrophoneActive(false); 
            if(currentActualStatus === 'error') toast.error("Connection failed. Cannot start microphone.");
          }
        }, 500); 
        return;
    }

    if (isMicrophoneActive) {
      liveGeminiClientRef.current.stopAudioStream();
      setIsMicrophoneActive(false);
      toast.info('Microphone off.');
    } else {
      liveGeminiClientRef.current.startAudioStream();
      setIsMicrophoneActive(true);
    }
  };

  const handleSendText = () => {
    if (textInput.trim() && liveGeminiClientRef.current && (clientStatus === 'connected' || clientStatus === 'processing' || clientStatus === 'listening')) {
      onMessageReceived({ role: 'user', content: textInput.trim() }, true); 
      liveGeminiClientRef.current.sendTextMessage(textInput.trim());
      setTextInput('');
    } else if (!liveGeminiClientRef.current || !['connected', 'processing', 'listening'].includes(clientStatus)) {
        toast.error("Cannot send text: Not connected or AI is busy speaking.");
    }
  };
  
  const MicButtonIcon = isMicrophoneActive && (clientStatus === 'listening' || clientStatus === 'speaking' || clientStatus === 'processing') ? Mic : MicOff;
  let currentMicButtonVariant: ButtonProps['variant'] = "outline"; 
  let micButtonText = "Start Listening";

  if (clientStatus === 'connecting') {
    micButtonText = "Connecting...";
    currentMicButtonVariant = "outline"; 
  } else if (isMicrophoneActive) {
    if (clientStatus === 'listening') {
      currentMicButtonVariant = "secondary"; 
      micButtonText = `Listening...`; 
    } else if (clientStatus === 'processing' || clientStatus === 'speaking') {
      currentMicButtonVariant = "secondary";
      micButtonText = "AI Active...";
    } else if (clientStatus === 'connected') { 
      currentMicButtonVariant = "default"; 
      micButtonText = "Stop Listening";
    } else { 
      currentMicButtonVariant = "destructive";
      micButtonText = "Stop Listening";
    }
  } else if (clientStatus === 'error') {
    currentMicButtonVariant = "destructive";
    micButtonText = "Error - Retry Mic";
  } else { 
    micButtonText = "Start Listening";
    currentMicButtonVariant = "outline";
  }


  return (
    <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
      {apiKey && <LiveGeminiClient
        ref={liveGeminiClientRef}
        apiKey={apiKey} 
        languageCode={languageCode}
        voiceName={voiceName}
        onStatusChange={handleLGCStatusChange}
        onError={handleLGCError}
        onTranscriptUpdate={handleLGCTranscriptUpdate} 
        onAIMessage={handleLGCAIMessage} 
        systemInstructions={systemInstructions}
        initialHistory={initialHistory}
      />}

      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleMicrophone}
          variant={currentMicButtonVariant}
          size="lg"
          className="transition-all duration-150 ease-in-out"
          disabled={clientStatus === 'connecting' || !apiKey} 
          aria-label={micButtonText}
        >
          {clientStatus === 'connecting' ? 
            <Loader2 className="h-5 w-5 animate-spin"/> :
            <MicButtonIcon className="h-5 w-5" />
          }
          <span className="ml-2 hidden sm:inline">{micButtonText}</span>
        </Button>

        <Input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Or type a message..."
          className="flex-grow"
          onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
          disabled={isMicrophoneActive || clientStatus === 'connecting' || clientStatus === 'listening' || clientStatus === 'speaking' || clientStatus === 'processing'}
        />
        <Button 
            onClick={handleSendText} 
            size="lg" 
            disabled={!textInput.trim() || isMicrophoneActive || clientStatus === 'connecting' || clientStatus === 'listening' || clientStatus === 'speaking' || clientStatus === 'processing'}
            aria-label="Send text message"
        >
          <Send className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline">Send</span>
        </Button>
      </div>

      {clientStatus === 'error' && lastError && (
        <div className="mt-2 text-xs text-red-500 flex items-center" role="alert">
          <AlertTriangle className="h-4 w-4 mr-1" /> {lastError}
          {apiKey && 
            <Button variant="ghost" size="sm" onClick={() => liveGeminiClientRef.current?.connect()} className="ml-2">
              <RotateCcw className="h-3 w-3 mr-1"/> Retry Connection
            </Button>
          }
        </div>
      )}
      {clientStatus === 'connecting' && (
         <p className="mt-2 text-xs text-muted-foreground text-center">Attempting to connect to WonderChat AI...</p>
      )}
       {!apiKey && clientStatus !== 'error' && ( 
         <p className="mt-2 text-xs text-red-600 text-center" role="alert">Chat service configuration missing. Voice Chat disabled.</p>
      )}
    </div>
  );
});

VoiceChat.displayName = 'VoiceChat';
export default VoiceChat;