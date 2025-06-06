
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Basic rate limiting (conceptual, replace with a robust library like 'express-rate-limit' if needed for standalone Node)
// For Next.js API routes, Vercel might offer some protection, or use a middleware.
const rateLimitMap = new Map();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Conceptual rate limiting
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown-ip-socket';
  const limit = 10; // 10 requests
  const windowMs = 60 * 1000; // 1 minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 0, lastRequestTime: Date.now() });
  }

  const ipData = rateLimitMap.get(ip);
  if (Date.now() - ipData.lastRequestTime > windowMs) {
    ipData.count = 0; // Reset count
    ipData.lastRequestTime = Date.now();
  }

  ipData.count += 1;
  if (ipData.count > limit) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
  }
  // End conceptual rate limiting

  // Use process.env.API_KEY as per guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error('API_KEY is not set in environment variables.');
    return NextResponse.json({ message: 'API key not configured on server.' }, { status: 500 });
  }

  // Return a nominal key or a status, not the actual key if it's for client-side SDK init.
  // For the current SPA structure where proxy handles Google auth, this key might be nominal
  // or used by client for other direct SDK calls if any.
  // If this key is passed to LiveGeminiClient, it's not directly used for WS connection to proxy.
  // For safety, let's assume this endpoint is for providing a key for *other* client-side Gemini SDK uses,
  // or a general "service access key". For the voice chat via proxy, this key isn't the one used by proxy to Google.
  return NextResponse.json({ apiKey: "CLIENT_SHOULD_RELY_ON_PROXY_AUTH" }); 
  // If an actual key needs to be sent for other purposes: return NextResponse.json({ apiKey });
  // But the best practice is for the proxy to handle all Google API key interactions.
  // The client React app does not need the Google API key if a proxy is used.
  // The ChatPage.tsx uses this to pass to ChatInterface -> VoiceChat -> LiveGeminiClient.
  // This `apiKey` prop in LiveGeminiClient is currently unused for the WS connection itself.
  // Let's pass the actual key if it exists, assuming it might be used for other SDK features not yet implemented.
  // return NextResponse.json({ apiKey });
}
