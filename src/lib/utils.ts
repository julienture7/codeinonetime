
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { VoiceOption } from '../types'; // Corrected relative path assuming types/index.ts is ../types from src/lib

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export const FIXED_MODEL_NAME_CONST = 'gemini-2.5-flash-preview-native-audio-dialog';
export const DEFAULT_VOICE_NAME = 'Aoede'; // Example default, Google may have specific names
export const DEFAULT_LANGUAGE_CODE = 'en-US';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'aoede', name: 'Storyteller (Female)', value: 'Aoede' },
  { id: 'puck', name: 'Playful Sprite (Male)', value: 'Puck' },
  { id: 'kore', name: 'Gentle Guide (Female)', value: 'Kore' },
  // Add more voices as supported by the Gemini Live API
];
// Removed duplicate import type { VoiceOption } from '@/types'; as it's now at the top
