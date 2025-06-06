
import type { VoiceOption } from './types';

export const FIXED_MODEL_NAME_CONST = 'gemini-2.5-flash-preview-native-audio-dialog'; // For Live Audio Chat
export const GEMINI_TEXT_MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // For general text tasks
export const GEMINI_IMAGE_MODEL_NAME = 'imagen-3.0-generate-002'; // For image generation

export const DEFAULT_VOICE_NAME = 'Aoede'; // Example default, Google may have specific names
export const DEFAULT_LANGUAGE_CODE = 'en-US';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'aoede', name: 'Storyteller (Female)', value: 'Aoede' },
  { id: 'puck', name: 'Playful Sprite (Male)', value: 'Puck' },
  { id: 'kore', name: 'Gentle Guide (Female)', value: 'Kore' },
  // Add more voices as supported by the Gemini Live API proxy or configuration
];

export const PROXY_SERVER_URL = 'ws://localhost:3001'; // Default WebSocket proxy URL
    