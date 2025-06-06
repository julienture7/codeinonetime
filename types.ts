
export interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioBase64?: string;
  isInterim?: boolean;
  createdAt?: Date;
}

export interface ChatConfig {
  voiceName: string;
  languageCode: string;
  modelName: string;
}

export interface VoiceOption {
  id: string;
  name: string; // User-friendly name, e.g., "Friendly Robot"
  value: string; // Actual voice name for API, e.g., "Aoede"
  previewUrl?: string; // Optional URL to preview voice
}

// If you were using Gemini directly for non-streaming text:
export interface GeminiMessagePart {
    text: string;
}
export interface GeminiContent {
    role: 'user' | 'model'; // Note: Gemini uses 'model' not 'assistant'
    parts: GeminiMessagePart[];
}

// Used by LiveGeminiClient for context
export interface LiveGeminiHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{text: string}>;
}