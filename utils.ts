
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to convert audio Float32Array to Int16 Base64 String
// This might be needed if the Gemini API/proxy expects Int16 PCM data.
export function float32ToInt16Base64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2); // 2 bytes per Int16
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i])); // Clamp to [-1, 1]
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true); // true for little-endian
  }
  // Convert ArrayBuffer to Base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
    