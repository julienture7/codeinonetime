
// import { User as PrismaUser } from '@prisma/client'; // Original problematic import

// Placeholder/Mock PrismaUser to satisfy TypeScript if @prisma/client is not available/generated
export type PrismaUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null; // Typically not exposed directly but part of the model
  role: string; // Was 'Role' enum, simplify to string for mock
  kidName?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Mock relations as needed, e.g., chatSessions: any[];
};


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

// Removed NextAuth module augmentations as they were causing errors
// and might not be relevant for the entire mixed SPA/Next.js structure.

export type User = PrismaUser; // This is your application's User type, potentially aliasing PrismaUser

export interface VoiceOption {
  id: string;
  name: string; // User-friendly name, e.g., "Friendly Robot"
  value: string; // Actual voice name for API, e.g., "Aoede"
  previewUrl?: string; // Optional URL to preview voice
}

// Added LiveGeminiHistoryEntry
export interface LiveGeminiHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{text: string}>;
}