
import * as React from 'react';
import { AudioInputManager, TARGET_SAMPLE_RATE } from './audio-input-manager';
import { FIXED_MODEL_NAME_CONST, PROXY_SERVER_URL as DEFAULT_PROXY_URL } from '../constants'; 
import { float32ToInt16Base64 } from '../utils'; 
import type { LiveGeminiHistoryEntry } from '../types';

// Google BidiGenerateContent Request/Response structures (simplified for client-side use)
interface BidiGenerateContentSetup {
  model: string; // e.g., "models/gemini-2.5-flash-preview-native-audio-dialog"
  generationConfig?: {
    responseModalities?: Array<'TEXT' | 'AUDIO'>;
    speechConfig?: {
      languageCode?: string;
      voiceConfig?: {
        prebuiltVoiceConfig?: { voiceName: string };
      };
    };
    // Add other GenerationConfig fields if needed: temperature, topK, topP etc.
  };
  systemInstruction?: { parts: Array<{ text: string }> };
  inputAudioTranscription?: {}; // Enable client audio transcription
  outputAudioTranscription?: {}; // Enable AI audio transcription
  realtimeInputConfig?: {
    automaticActivityDetection?: { disabled?: boolean };
    // Other VAD configs
  };
  // sessionResumption, contextWindowCompression etc. can be added if needed
}

interface BidiClientMessage {
  setup?: BidiGenerateContentSetup;
  clientContent?: {
    turns: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    turnComplete?: boolean;
  };
  realtimeInput?: {
    audio?: { mimeType: string; data: string }; // data is base64 audio
    activityStart?: {};
    activityEnd?: {};
    audioStreamEnd?: boolean;
    text?: string; // For real-time text input if used differently from clientContent
  };
  // toolResponse for function calling if implemented
}

// Google BidiGenerateContent Server Message Structure (simplified)
interface BidiServerMessage {
  setupComplete?: {}; // Confirms setup is done
  serverContent?: {
    modelTurn?: {
      parts: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string }; // For audio output
        // executableCode, codeExecutionResult for code execution tool
      }>;
    };
    inputTranscription?: { text: string };
    outputTranscription?: { text: string };
    generationComplete?: boolean;
    turnComplete?: boolean;
    interrupted?: boolean;
    // groundingMetadata, urlContextMetadata
  };
  toolCall?: { functionCalls: Array<any> }; // For function calling
  toolCallCancellation?: { ids: string[] };
  goAway?: { timeLeft: string }; // Server will disconnect
  sessionResumptionUpdate?: { newHandle?: string; resumable?: boolean };
  usageMetadata?: any; // Token counts etc.
  error?: { code?: number; message: string; details?: any[] }; // More structured error
  type?: 'proxy_status' | 'error'; // Custom types from proxy itself
  status?: string; // Generic status from proxy or Google
  message?: string; // Generic message from proxy
}


export type LiveGeminiClientStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'listening' | 'processing' | 'speaking';

export interface LiveGeminiClientHandles {
  connect: () => void;
  disconnect: () => void;
  startAudioStream: () => void;
  stopAudioStream: () => void;
  sendTextMessage: (text: string) => void;
  isStreamingAudio: () => boolean;
}

interface LiveGeminiClientProps {
  apiKey: string; // Used for SDK or if proxy needs it, but generally proxy handles Google Auth
  languageCode: string;
  voiceName: string; 
  
  onStatusChange?: (status: LiveGeminiClientStatus) => void;
  onError?: (error: string) => void;
  onTranscriptUpdate?: (transcript: string, isFinal: boolean, role: 'user' | 'assistant') => void; 
  onAIMessage?: (text: string, audioBase64?: string, isFinal?: boolean) => void; 

  systemInstructions?: string; 
  initialHistory?: LiveGeminiHistoryEntry[];
}

const PROXY_SERVER_URL = (typeof process !== 'undefined' && process.env && process.env.WEBSOCKET_PROXY_URL) || (window as any).WEBSOCKET_PROXY_URL || DEFAULT_PROXY_URL;


const LiveGeminiClient = React.forwardRef<LiveGeminiClientHandles, LiveGeminiClientProps>(
  (props, ref) => {
    const { 
      apiKey, 
      onStatusChange, onError, onTranscriptUpdate, onAIMessage,
      languageCode, voiceName, systemInstructions, initialHistory, 
    } = props;

    const ws = React.useRef<WebSocket | null>(null);
    const audioInputManager = React.useRef<AudioInputManager | null>(null);
    const audioPlaybackQueue = React.useRef<string[]>([]);
    const isPlayingAudio = React.useRef(false);
    const audioContextRef = React.useRef<AudioContext | null>(null);

    const [status, setStatus] = React.useState<LiveGeminiClientStatus>('disconnected');
    const [isAudioStreamingActive, setIsAudioStreamingActive] = React.useState(false);
    const [isGoogleSetupComplete, setIsGoogleSetupComplete] = React.useState(false);


    const updateStatus = React.useCallback((newStatus: LiveGeminiClientStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    }, [onStatusChange]);

    const handleError = React.useCallback((errorMsg: string, isSevere: boolean = true) => {
      console.error('LiveGeminiClient Error:', errorMsg);
      if (isSevere) updateStatus('error');
      onError?.(errorMsg);
    }, [updateStatus, onError]);

    const playNextAudioChunk = React.useCallback(async () => {
      if (isPlayingAudio.current || audioPlaybackQueue.current.length === 0) {
        return;
      }
      isPlayingAudio.current = true;
      updateStatus('speaking');

      const base64Audio = audioPlaybackQueue.current.shift();
      if (!base64Audio) {
        isPlayingAudio.current = false;
        if(audioPlaybackQueue.current.length === 0 && status !== 'disconnected' && status !== 'error' && status !== 'connecting') {
            updateStatus('connected'); 
        }
        return;
      }

      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new AudioContext({ sampleRate: 24000 }); 
        }
        const audioContextVal = audioContextRef.current; 
        const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer;
        const audioBuffer = await audioContextVal.decodeAudioData(audioData as ArrayBuffer);
        
        const source = audioContextVal.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextVal.destination);
        source.start();
        source.onended = () => {
          isPlayingAudio.current = false;
          if (audioPlaybackQueue.current.length > 0) {
            playNextAudioChunk();
          } else if (status !== 'disconnected' && status !== 'error' && status !== 'connecting') {
            updateStatus('connected');
          }
        };
      } catch (e) {
        handleError(`Audio playback error: ${(e as Error).message}`);
        isPlayingAudio.current = false;
         if (status !== 'disconnected' && status !== 'error' && status !== 'connecting') {
            updateStatus('connected');
         }
      }
    }, [updateStatus, handleError, status]);


    const sendToProxy = React.useCallback((message: BidiClientMessage) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            handleError("Cannot send message: WebSocket not connected to proxy.", false);
        }
    }, [handleError]);
    

    const connect = React.useCallback(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected.');
        return;
      }
      updateStatus('connecting');
      setIsGoogleSetupComplete(false);
      ws.current = new WebSocket(PROXY_SERVER_URL);

      ws.current.onopen = () => {
        // Status will be updated to 'connected' once Google setup is complete
        console.log('Connected to WebSocket proxy. Sending setup to Google...');
        
        const setupPayload: BidiGenerateContentSetup = { 
          model: `models/${FIXED_MODEL_NAME_CONST}`, // Ensure "models/" prefix
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              // languageCode: languageCode, // Often auto-detected for native audio models
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName }}
            }
          },
          ...(systemInstructions && { systemInstruction: { parts: [{ text: systemInstructions }] } }),
          // inputAudioTranscription: {}, // Optional: If you want Google to transcribe user audio and send it back
          outputAudioTranscription: {}, // Request transcript of AI's audio output
        };
        sendToProxy({ setup: setupPayload });
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as BidiServerMessage; 

          if (message.error) { // Error from Google or proxy
            handleError(message.error.message || 'Unknown error from server.');
            return;
          }

          if (message.type === 'proxy_status') { // Custom message from proxy
            console.log("Proxy status update:", message.message);
            if (message.status === 'disconnected_from_google') {
                handleError("Proxy lost connection to Google AI.", true);
            }
            return;
          }
          
          if (message.setupComplete) {
            setIsGoogleSetupComplete(true);
            updateStatus('connected');
            console.log('Google BidiGenerateContent Setup Complete.');
            // Send initial history if any
            if (initialHistory && initialHistory.length > 0) {
                const historyTurns = initialHistory.map(h => ({
                    role: h.role, // 'user' or 'model'
                    parts: h.parts.map(p => ({text: p.text}))
                }));
                sendToProxy({ clientContent: { turns: historyTurns, turnComplete: false }});
            }
            return;
          }

          if (message.serverContent) {
            const sc = message.serverContent;
            let aiText: string | undefined = undefined;
            let aiAudioBase64: string | undefined = undefined;

            if (sc.modelTurn && sc.modelTurn.parts && sc.modelTurn.parts.length > 0) {
                // Assuming first part could be text or audio. A more robust parser would check mimeTypes.
                const firstPart = sc.modelTurn.parts[0];
                if (firstPart.text) {
                    aiText = firstPart.text;
                }
                if (firstPart.inlineData && firstPart.inlineData.mimeType?.startsWith('audio/')) {
                    aiAudioBase64 = firstPart.inlineData.data;
                }
                 // If there's a separate outputTranscription, prefer that as the "text" part of AI message
                 if (sc.outputTranscription?.text) {
                    aiText = sc.outputTranscription.text;
                }
            }
            // Fallback or override with explicit outputTranscription if available
            if (sc.outputTranscription?.text) {
                aiText = sc.outputTranscription.text;
                if(onTranscriptUpdate) onTranscriptUpdate(aiText, !!sc.generationComplete, 'assistant');
            }


            if (aiAudioBase64) {
              audioPlaybackQueue.current.push(aiAudioBase64);
              playNextAudioChunk();
            }
            if (aiText && onAIMessage) {
                // If audio is present, onAIMessage might just handle text and audio indication
                onAIMessage(aiText, aiAudioBase64 ? "" : undefined, !!sc.generationComplete);
            }
            
            if (sc.inputTranscription?.text && onTranscriptUpdate) {
                // This is transcription of user's audio
                onTranscriptUpdate(sc.inputTranscription.text, !!sc.turnComplete, 'user'); // User turn is complete if Google says so
                if (sc.turnComplete) updateStatus('processing'); else updateStatus('listening');
            }

            if(sc.generationComplete && !aiAudioBase64 && audioPlaybackQueue.current.length === 0) {
              if (status !== 'disconnected' && status !== 'error' && status !== 'connecting') {
                updateStatus('connected');
              }
            } else if (sc.turnComplete && !sc.generationComplete && status === 'speaking'){
                 // If AI turn complete but not full generation and it was speaking, may go back to connected/listening
                 // updateStatus('connected'); // Or listening if expecting user input
            }
          }

        } catch (e) {
          handleError(`Error processing message from proxy: ${(e as Error).message}`);
        }
      };

      ws.current.onerror = (errorEvent) => {
        console.error('WebSocket error:', errorEvent);
        handleError('WebSocket connection error. Please check proxy server and network.', true);
      };

      ws.current.onclose = (closeEvent) => {
        console.log('WebSocket disconnected from proxy:', closeEvent.reason ? closeEvent.reason.toString() : 'No reason');
        setIsGoogleSetupComplete(false);
        updateStatus('disconnected');
        if (audioInputManager.current?.isStarted()) {
          audioInputManager.current.stop();
          setIsAudioStreamingActive(false);
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateStatus, handleError, languageCode, voiceName, systemInstructions, initialHistory, playNextAudioChunk, sendToProxy]); 

    const disconnect = React.useCallback(() => {
      if (audioInputManager.current?.isStarted()) {
        audioInputManager.current.stop();
        setIsAudioStreamingActive(false);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error("Error closing playback AudioContext:", e));
        audioContextRef.current = null;
      }
      audioPlaybackQueue.current = [];
      isPlayingAudio.current = false;
      setIsGoogleSetupComplete(false);
      updateStatus('disconnected');
    }, [updateStatus]);

    const handleAudioData = React.useCallback((pcmData: Float32Array) => {
      if (isGoogleSetupComplete && ws.current && ws.current.readyState === WebSocket.OPEN && isAudioStreamingActive) {
        const base64Audio = float32ToInt16Base64(pcmData); 
        sendToProxy({ 
            realtimeInput: { 
                audio: { mimeType: "audio/pcm;rate=16000", data: base64Audio }
            }
        });
      }
    }, [isGoogleSetupComplete, isAudioStreamingActive, sendToProxy]);

    const handleVADActivityStart = React.useCallback(() => {
        if(status !== 'speaking' && status !== 'processing') updateStatus('listening'); 
        // If Google VAD is disabled in setup, send: sendToProxy({ realtimeInput: { activityStart: {} } });
    }, [updateStatus, status]);

    const handleVADActivityEnd = React.useCallback(() => {
        if (status === 'listening') updateStatus('processing'); 
        // If Google VAD is disabled, send: sendToProxy({ realtimeInput: { activityEnd: {} } });
        // Also good to send audioStreamEnd if mic is logically off for a bit.
        // sendToProxy({ realtimeInput: { audioStreamEnd: true } });
    }, [updateStatus, status]);

    React.useEffect(() => {
      audioInputManager.current = new AudioInputManager(
        handleAudioData,
        handleVADActivityStart, 
        handleVADActivityEnd,  
        (err) => handleError(err, false) // VAD/mic errors might not be severe enough to kill connection
      );
      
      if (apiKey && status === 'disconnected') { // apiKey here is nominal, connection relies on proxy
        connect();
      }
      return () => { 
        disconnect();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, connect, disconnect]); // handleAudioData, handleVAD* are stable due to useCallback

    const startAudioStream = React.useCallback(() => {
      if (!audioInputManager.current) return;
      if (!isGoogleSetupComplete) {
        handleError("Cannot start audio: Google connection not fully set up.", false);
        return;
      }
      if (!audioInputManager.current.isStarted()) {
        audioInputManager.current.start().then(() => {
          setIsAudioStreamingActive(true);
          if(status !== 'speaking' && status !== 'processing') updateStatus('listening');
          console.log('Audio stream started.');
        }).catch(e => {
            handleError("Failed to start audio stream: " + (e as Error).message, false);
        });
      } else {
        setIsAudioStreamingActive(true);
        if(status !== 'speaking' && status !== 'processing') updateStatus('listening');
      }
    }, [handleError, updateStatus, status, isGoogleSetupComplete]);

    const stopAudioStream = React.useCallback(() => {
      setIsAudioStreamingActive(false);
      // Inform Google that audio input is paused. This is important for VAD.
      // sendToProxy({ realtimeInput: { audioStreamEnd: true } }); 
      if(status === 'listening') updateStatus('connected'); 
      console.log('Audio stream sending stopped.');
    }, [updateStatus, status]);

    const sendTextMessage = React.useCallback((text: string) => {
      if (!isGoogleSetupComplete) {
        handleError("Cannot send text: Google connection not fully set up.", false);
        return;
      }
      sendToProxy({ 
          clientContent: { 
              turns: [{ role: 'user', parts: [{ text: text }] }],
              turnComplete: true 
            }
        });
      updateStatus('processing'); 
    }, [updateStatus, handleError, sendToProxy, isGoogleSetupComplete]);

    React.useImperativeHandle(ref, () => ({
      connect,
      disconnect,
      startAudioStream,
      stopAudioStream,
      sendTextMessage,
      isStreamingAudio: () => isAudioStreamingActive && (audioInputManager.current?.isStarted() ?? false),
    }));

    return null; 
  }
);

LiveGeminiClient.displayName = 'LiveGeminiClient';
export default LiveGeminiClient;
