
'use client';
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import LiveGeminiClient, { LiveGeminiClientHandles, LiveGeminiClientStatus } from '../../lib/live-gemini';
import { Button, type ButtonProps } from './button'; 
import { Input } from './input';
import { Mic, MicOff, Send, RotateCcw, AlertTriangle, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { DisplayMessage, LiveGeminiHistoryEntry } from '../../types'; 

interface VoiceChatProps {
  apiKey: string | null; // Nominal API key, actual auth handled by proxy
  languageCode: string;
  voiceName: string; 
  
  onMessageReceived: (message: Omit<DisplayMessage, 'id' | 'createdAt'>, isFinal: boolean) => void;
  onInterimTranscriptUpdate: (transcript: string, role: 'user' | 'assistant') => void;

  systemInstructions?: string;
  initialHistoryProp?: LiveGeminiHistoryEntry[]; 

  kidName: string; 
}

const VoiceChat: React.FC<VoiceChatProps> = React.memo(({
  apiKey, languageCode, voiceName,
  onMessageReceived, onInterimTranscriptUpdate,
  systemInstructions, initialHistoryProp, kidName,
}) => {
  const liveGeminiClientRef = useRef<LiveGeminiClientHandles>(null);
  const [clientStatus, setClientStatus] = useState<LiveGeminiClientStatus>('disconnected');
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false); 
  const [textInput, setTextInput] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);

  const clientStatusRef = React.useRef(clientStatus); // Ref to get current status in timeouts
  React.useEffect(() => {
    clientStatusRef.current = clientStatus;
  }, [clientStatus]);

  const initialHistory = useMemo(() => initialHistoryProp, [initialHistoryProp]);

  const handleLGCStatusChange = useCallback((status: LiveGeminiClientStatus) => {
    setClientStatus(status);
    if (status !== 'error') { 
        setLastError(null); 
    }
    
    toast.dismiss(); // Clear previous toasts

    if(status === 'listening' && isMicrophoneActive){
        toast.message(`Listening, ${kidName}...`, { icon: <Mic className="h-4 w-4 text-green-500"/>, id: 'status-toast', duration: 5000 });
    } else if (status === 'processing') { // User or AI processing
        toast.loading('WonderChat is thinking...', { id: 'status-toast', duration: 15000 });
    } else if (status === 'speaking') {
        toast.message('WonderChat is responding...', { icon: <Info className="h-4 w-4 text-blue-500"/>, id: 'status-toast', duration: 10000 });
    } else if (status === 'connected') { 
        toast.success('Ready to chat!', { id: 'status-toast', duration: 3000 });
    } else if (status === 'connecting') {
        toast.loading('Connecting to WonderChat AI...', { id: 'status-toast', duration: 30000});
    }
  }, [isMicrophoneActive, kidName]);

  const handleLGCError = useCallback((error: string) => {
    setLastError(error);
    setClientStatus('error'); 
    toast.error(`Chat Error: ${error}`, { duration: 10000, id: 'error-toast' });
    if (error.toLowerCase().includes("websocket") || error.toLowerCase().includes("microphone access") || error.toLowerCase().includes("proxy")) {
        setIsMicrophoneActive(false);
        if (liveGeminiClientRef.current?.isStreamingAudio()) {
            liveGeminiClientRef.current?.stopAudioStream();
        }
    }
  }, []);

  const handleLGCTranscriptUpdate = useCallback((transcript: string, isFinal: boolean, role: 'user' | 'assistant') => {
    onInterimTranscriptUpdate(transcript, role); 
    // Final user message is handled when AI starts responding or via explicit onMessageReceived from LGC
    // Final AI message is via onAIMessage
  }, [onInterimTranscriptUpdate]);

  const handleLGCAIMessage = useCallback((text: string, audioBase64?: string, isFinal?: boolean) => {
    // This callback is for AI's final messages or significant updates.
    // Interim AI speech can be handled by onTranscriptUpdate with role 'assistant'.
    onMessageReceived({ role: 'assistant', content: text, audioBase64: audioBase64 }, !!isFinal);
  }, [onMessageReceived]);


  useEffect(() => {
    // `apiKey` here is nominal for LiveGeminiClient if proxy handles auth.
    // The client needs to attempt connection if it's currently disconnected.
    if (apiKey && clientStatus === 'disconnected' && liveGeminiClientRef.current) { 
      liveGeminiClientRef.current.connect();
    }
    
    return () => {
      if (liveGeminiClientRef.current) {
         liveGeminiClientRef.current.disconnect();
      }
    };
  // liveGeminiClientRef is stable, clientStatus changes trigger re-evaluation.
  }, [apiKey, clientStatus]); 

  const toggleMicrophone = () => {
    if (!liveGeminiClientRef.current || !apiKey) { 
        if (!apiKey) toast.error("Chat service not available: Configuration missing.");
        else toast.error("Chat client not ready.");
        return;
    }
    
    if (clientStatus === 'disconnected' || clientStatus === 'error') {
        liveGeminiClientRef.current.connect(); 
        // Starting audio stream will be attempted after connection is established (see LGC logic or status changes)
        // For now, just set UI intent, LGC will handle actual stream start on 'connected'
        if (clientStatus !== 'error') setIsMicrophoneActive(true); // Tentatively set, LGC status will confirm
        return;
    }

    if (isMicrophoneActive) {
      liveGeminiClientRef.current.stopAudioStream();
      setIsMicrophoneActive(false);
      // toast.info('Microphone off.'); // Status change will handle toasts
    } else {
      liveGeminiClientRef.current.startAudioStream();
      setIsMicrophoneActive(true);
    }
  };

  const handleSendText = () => {
    if (textInput.trim() && liveGeminiClientRef.current && 
        (clientStatus === 'connected' || clientStatus === 'listening' || clientStatus === 'processing')) {
      onMessageReceived({ role: 'user', content: textInput.trim() }, true); 
      liveGeminiClientRef.current.sendTextMessage(textInput.trim());
      setTextInput('');
    } else {
        toast.error("Cannot send: Not connected or AI is active.", {duration: 3000});
    }
  };
  
  const MicButtonIcon = isMicrophoneActive ? Mic : MicOff;
  let currentMicButtonVariant: ButtonProps['variant'] = "outline"; 
  let micButtonText = "Start Listening";
  let micButtonDisabled = !apiKey;


  if (clientStatus === 'connecting') {
    micButtonText = "Connecting...";
    currentMicButtonVariant = "outline"; 
    micButtonDisabled = true;
  } else if (isMicrophoneActive) {
    if (clientStatus === 'listening') {
      currentMicButtonVariant = "secondary"; 
      micButtonText = `Listening...`; 
    } else if (clientStatus === 'processing' || clientStatus === 'speaking') {
      currentMicButtonVariant = "secondary"; // Visually indicates activity
      micButtonText = "AI Active...";
      micButtonDisabled = true; // Can't toggle mic while AI is processing/speaking
    } else if (clientStatus === 'connected') { 
      currentMicButtonVariant = "default"; 
      micButtonText = "Stop Listening";
    } else { // Error or other states while mic was on
      currentMicButtonVariant = "destructive";
      micButtonText = "Stop Listening";
    }
  } else { // Microphone is Off
    if (clientStatus === 'error') {
        currentMicButtonVariant = "destructive";
        micButtonText = "Retry Mic";
    } else if (clientStatus === 'connected' || clientStatus === 'disconnected') {
        micButtonText = "Start Listening";
        currentMicButtonVariant = "outline";
    } else { // Processing, Speaking but mic is off (e.g. after text input)
        micButtonText = "AI Active";
        micButtonDisabled = true;
    }
  }


  return (
    <div className="p-4 border-t border-border bg-background/80 backdrop-blur-sm">
      {/* LiveGeminiClient is non-visual, apiKey presence controls its activation */}
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
          disabled={micButtonDisabled} 
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
          onKeyPress={(e) => e.key === 'Enter' && !micButtonDisabled && handleSendText()}
          disabled={isMicrophoneActive || micButtonDisabled || clientStatus === 'speaking' || clientStatus === 'processing'}
        />
        <Button 
            onClick={handleSendText} 
            size="lg" 
            disabled={!textInput.trim() || isMicrophoneActive || micButtonDisabled || clientStatus === 'speaking' || clientStatus === 'processing'}
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
            <Button variant="ghost" size="sm" onClick={() => liveGeminiClientRef.current?.connect()} className="ml-2 text-red-500 hover:text-red-400">
              <RotateCcw className="h-3 w-3 mr-1"/> Retry
            </Button>
          }
        </div>
      )}
       {!apiKey && clientStatus !== 'error' && ( 
         <p className="mt-2 text-xs text-orange-500 text-center" role="alert">
           <AlertTriangle className="h-4 w-4 mr-1 inline"/> Chat service configuration issue. Voice features disabled.
         </p>
      )}
    </div>
  );
});

VoiceChat.displayName = 'VoiceChat';
export default VoiceChat;
