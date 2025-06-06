'use client';
import React, { useState, useEffect, useRef, useImperativeHandle, useMemo, useCallback } from 'react';
import { AudioInputManager, TARGET_SAMPLE_RATE } from './audio-input-manager';
import { FIXED_MODEL_NAME_CONST } from './utils';
import type { LiveGeminiHistoryEntry } from '../types'; // Corrected path to src types


// Types for messages exchanged with the proxy server and Google Live API
// These are illustrative and need to match the actual API spec used by the proxy.
interface GeminiSetupMessage {
  type: 'setup';
  model: string;
  languageCode: string;
  // Potentially other config: voiceName for TTS, context, etc.
  // For `gemini-2.5-flash-preview-native-audio-dialog`, specific params might be needed.
  audio?: { // Client audio config
    sampleRateHertz: number;
    // encoding: 'LINEAR16' | 'FLAC' | ... // Google might expect specific encoding via proxy
  };
  // Config for what the server should send back
  outputAudioConfig?: {
    sampleRateHertz: number; // e.g., 24000 for high quality TTS
    // encoding: 'MP3' | 'LINEAR16' | ...
  };
  // Add other necessary fields as per Google's BidiGenerateContent API requirements for this model
  // e.g., turnConfig, singleUtterance, interimResults etc.
}

interface ClientAudioMessage {
  type: 'audio_chunk';
  payload: string; // Base64 encoded audio PCM data
}

interface ClientTextMessage {
  type: 'text_input';
  text: string;
}

interface ServerResponseMessage {
  type: 'server_response'; // Could be 'transcript_update', 'audio_output', 'error', 'status'
  transcript?: string;
  isFinal?: boolean;
  audioPayload?: string; // Base64 encoded audio from AI
  error?: string;
  status?: string; // e.g., 'LISTENING', 'PROCESSING', 'SPEAKING'
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
  apiKey: string; 
  languageCode: string;
  voiceName: string; // For TTS, if configurable and proxy passes it
  // modelName: string; // Using FIXED_MODEL_NAME_CONST
  
  // Callbacks
  onStatusChange?: (status: LiveGeminiClientStatus) => void;
  onError?: (error: string) => void;
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void; // User's speech
  onAIMessage?: (text: string, audioBase64?: string, isFinal?: boolean) => void; // AI's speech/text

  // System instructions / context - to be sent in initial setup message
  systemInstructions?: string; 
  initialHistory?: LiveGeminiHistoryEntry[];
}

const PROXY_SERVER_URL = process.env.NEXT_PUBLIC_WEBSOCKET_PROXY_URL || 'ws://localhost:3001';

const LiveGeminiClient = React.forwardRef<LiveGeminiClientHandles, LiveGeminiClientProps>(
  (props, ref) => {
    const { 
      apiKey, // Destructure apiKey
      onStatusChange, onError, onTranscriptUpdate, onAIMessage,
      languageCode, systemInstructions, initialHistory
    } = props;

    const ws = useRef<WebSocket | null>(null);
    const audioInputManager = useRef<AudioInputManager | null>(null);
    const audioPlaybackQueue = useRef<string[]>([]);
    const isPlayingAudio = useRef(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const [status, setStatus] = useState<LiveGeminiClientStatus>('disconnected');
    const [_isAudioStreaming, setIsAudioStreaming] = useState(false); // internal state for AIM

    const updateStatus = useCallback((newStatus: LiveGeminiClientStatus) => {
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    }, [onStatusChange]);

    const handleError = useCallback((errorMsg: string) => {
      console.error('LiveGeminiClient Error:', errorMsg);
      updateStatus('error');
      onError?.(errorMsg);
    }, [updateStatus, onError]);

    const playNextAudioChunk = useCallback(async () => {
      if (isPlayingAudio.current || audioPlaybackQueue.current.length === 0) {
        return;
      }
      isPlayingAudio.current = true;
      updateStatus('speaking');

      const base64Audio = audioPlaybackQueue.current.shift();
      if (!base64Audio) {
        isPlayingAudio.current = false;
        if(audioPlaybackQueue.current.length === 0) updateStatus('connected'); // or 'listening' if appropriate
        return;
      }

      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new AudioContext(); // Google often sends 24kHz audio
        }
        const audioContext = audioContextRef.current;
        const audioBuffer = await audioContext.decodeAudioData(
          Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0)).buffer as ArrayBuffer
        );
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        source.onended = () => {
          isPlayingAudio.current = false;
          if (audioPlaybackQueue.current.length > 0) {
            playNextAudioChunk();
          } else {
            // Check if still connected or needs a different status
             if(status !== 'disconnected' && status !== 'error' && status !== 'connecting') {
                updateStatus('connected'); // Or listening if that's the default post-AI speech state
             }
          }
        };
      } catch (e) {
        handleError(`Audio playback error: ${(e as Error).message}`);
        isPlayingAudio.current = false;
        // updateStatus('connected'); // Or appropriate state
      }
    }, [updateStatus, handleError, status]);


    const connect = useCallback(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected.');
        return;
      }
      updateStatus('connecting');
      ws.current = new WebSocket(PROXY_SERVER_URL);

      ws.current.onopen = () => {
        updateStatus('connected');
        console.log('Connected to WebSocket proxy.');
        
        // Send initial setup message to Gemini via proxy
        // The exact structure depends on what the proxy expects and what Google's BidiGenerateContent needs.
        const setupMsg: GeminiSetupMessage = { // This type is illustrative
          type: 'setup',
          model: FIXED_MODEL_NAME_CONST,
          languageCode: languageCode,
          audio: {
            sampleRateHertz: TARGET_SAMPLE_RATE,
            // encoding: 'LINEAR16' // Assuming proxy handles this conversion if needed by Google
          },
          outputAudioConfig: {
            sampleRateHertz: 24000, // Common for Google TTS, adjust if needed
            // encoding: 'MP3' or 'LINEAR16' for raw PCM. Proxy might choose.
          },
          // TODO: Add systemInstructions and initialHistory according to Google's API spec
          // This might be part of a "context" or "config" object in the setup.
          // Example (highly dependent on actual Google API for this model):
          // config: {
          //   system_instruction: { parts: [{ text: systemInstructions }] },
          //   tools: [], // If any tools are used
          //   initial_turns: initialHistory, // If chat history is supported
          // }
        };
        if (ws.current) ws.current.send(JSON.stringify(setupMsg));
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as ServerResponseMessage; // Type assertion
          // console.log('Received from proxy:', message);

          if (message.error) {
            handleError(message.error);
            return;
          }
          
          if(message.status) {
             // Potentially map Google's detailed statuses to LiveGeminiClientStatus
             // For now, just log it.
             console.log("Gemini status update:", message.status);
          }

          // Handle transcript updates (user's speech)
          if (message.transcript && onTranscriptUpdate) { // Check onTranscriptUpdate existence
            onTranscriptUpdate(message.transcript, !!message.isFinal);
            if(message.isFinal){
                updateStatus('processing'); // User finished, AI is processing
            } else {
                updateStatus('listening'); // User is speaking
            }
          }

          // Handle AI responses (text and/or audio)
          if (message.type === 'server_response' && onAIMessage) { // Check onAIMessage existence
            if (message.audioPayload) {
              audioPlaybackQueue.current.push(message.audioPayload);
              playNextAudioChunk();
            }
            // The AI text might come with audio, or separately.
            // It could be interim or final.
            if (message.transcript && !message.isFinal) { // Assuming AI interim transcript
                onAIMessage(message.transcript, undefined, false);
            } else if (message.transcript && message.isFinal) { // Assuming AI final transcript
                onAIMessage(message.transcript, message.audioPayload ? "" : undefined, true); // audio handled by queue
            }
            // If text comes without transcript field but as part of general response
            // else if (message.text && onAIMessage) { 
            //    onAIMessage(message.text, message.audioPayload ? "" : undefined, !!message.isFinal);
            // }

            if(message.isFinal && !message.audioPayload && audioPlaybackQueue.current.length === 0) {
              // If it's a final text message without audio, and no audio is pending.
              updateStatus('connected');
            }
          }

        } catch (e) {
          handleError(`Error processing message from proxy: ${(e as Error).message}`);
        }
      };

      ws.current.onerror = (errorEvent) => {
        console.error('WebSocket error:', errorEvent);
        handleError('WebSocket connection error. Please try again.');
      };

      ws.current.onclose = (closeEvent) => {
        console.log('WebSocket disconnected from proxy:', closeEvent.reason);
        updateStatus('disconnected');
        if (audioInputManager.current?.isStarted()) {
          audioInputManager.current.stop();
          setIsAudioStreaming(false);
        }
      };
    }, [updateStatus, handleError, languageCode, onTranscriptUpdate, onAIMessage, playNextAudioChunk, systemInstructions, initialHistory]);

    const disconnect = useCallback(() => {
      if (audioInputManager.current?.isStarted()) {
        audioInputManager.current.stop();
        setIsAudioStreaming(false);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      audioPlaybackQueue.current = [];
      isPlayingAudio.current = false;
      updateStatus('disconnected');
    }, [updateStatus]);

    const handleAudioData = useCallback((pcmData: Float32Array) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN && _isAudioStreaming) {
        // Convert Float32Array PCM to base64 string of Int16 PCM if needed by proxy/Google
        // For simplicity, sending Float32Array as base64. Proxy or Google might expect Int16.
        // This conversion needs to be accurate based on what the Gemini Live API endpoint expects.
        // Let's assume for now the proxy expects base64 of the raw Float32 data buffer.
        // Or more likely, Int16.
        const buffer = new ArrayBuffer(pcmData.length * 2); // 2 bytes per Int16
        const view = new DataView(buffer);
        for (let i = 0; i < pcmData.length; i++) {
          view.setInt16(i * 2, pcmData[i] * 0x7FFF, true); // true for little-endian
        }
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        
        const audioMsg: ClientAudioMessage = { type: 'audio_chunk', payload: base64Audio };
        ws.current.send(JSON.stringify(audioMsg));
      }
    }, [_isAudioStreaming]);

    const handleVADActivityStart = useCallback(() => {
        if(status !== 'speaking') updateStatus('listening'); // User starts speaking
        // Inform proxy/Gemini that user speech has started, if API requires explicit signals
    }, [updateStatus, status]);

    const handleVADActivityEnd = useCallback(() => {
        // User stopped speaking. If API requires explicit "end of speech" signal, send it.
        // Otherwise, Gemini might detect end of speech from silence in audio stream.
        // The onTranscriptUpdate(transcript, true) from Gemini will indicate its understanding of end of user turn.
        if (status === 'listening') updateStatus('processing'); // User finished, AI likely processing
    }, [updateStatus, status]);

    useEffect(() => {
      // Initialize AudioInputManager
      audioInputManager.current = new AudioInputManager(
        handleAudioData,
        handleVADActivityStart, // VAD start
        handleVADActivityEnd,   // VAD end
        handleError
      );
      return () => { // Cleanup on component unmount
        disconnect();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Create AIM once. Dependencies are stable.

    const startAudioStream = useCallback(() => {
      if (!audioInputManager.current?.isStarted()) {
        audioInputManager.current?.start().then(() => {
          setIsAudioStreaming(true);
          // status might already be 'listening' due to VAD, or set it here
          if(status !== 'speaking') updateStatus('listening');
          console.log('Audio stream started.');
        }).catch(handleError);
      } else {
        setIsAudioStreaming(true);
        if(status !== 'speaking') updateStatus('listening');
      }
    }, [handleError, updateStatus, status]);

    const stopAudioStream = useCallback(() => {
      // Don't stop AIM completely, just logical stop of sending. VAD will handle actual silence.
      // Or, if this means "hard stop mic", then:
      // audioInputManager.current?.stop();
      setIsAudioStreaming(false);
      // Status update might depend on context, e.g., if AI is speaking or user just paused.
      if(status === 'listening') updateStatus('connected'); // Back to idle connected state
      console.log('Audio stream sending stopped.');
    }, [updateStatus, status]);

    const sendTextMessage = useCallback((text: string) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        const textMsg: ClientTextMessage = { type: 'text_input', text };
        ws.current.send(JSON.stringify(textMsg));
        updateStatus('processing'); // Assuming AI processes after text input
      } else {
        handleError('Cannot send text: WebSocket not connected.');
      }
    }, [updateStatus, handleError]);

    useImperativeHandle(ref, () => ({
      connect,
      disconnect,
      startAudioStream,
      stopAudioStream,
      sendTextMessage,
      isStreamingAudio: () => _isAudioStreaming && (audioInputManager.current?.isStarted() ?? false),
    }));

    // Effect to connect if apiKey is provided
    useEffect(() => {
      if (apiKey && status === 'disconnected') {
        connect();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiKey, status, connect]); // Add apiKey, status and connect as dependencies


    return null; // This component is non-visual
  }
);

LiveGeminiClient.displayName = 'LiveGeminiClient';
export default LiveGeminiClient;