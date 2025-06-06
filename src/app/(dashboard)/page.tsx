
'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';     // Corrected relative path
import { Input } from '../../components/ui/input';      // Corrected relative path
import { Label } from '../../components/ui/label';      // Corrected relative path
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card'; // Corrected relative path
import { VoiceSelectionPanel } from '../../components/ui/voice-selection-panel'; // Corrected relative path
import { toast } from 'sonner';
import { Loader2, PlayCircle, Settings2 } from 'lucide-react';
import { DEFAULT_VOICE_NAME, DEFAULT_LANGUAGE_CODE, FIXED_MODEL_NAME_CONST } from '../../lib/utils'; // Corrected relative path

export default function DashboardPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [kidNameInput, setKidNameInput] = useState('');
  const [isSettingKidName, setIsSettingKidName] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(DEFAULT_VOICE_NAME);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.kidName) {
      setKidNameInput(session.user.kidName);
    }
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }
  
  const handleSetKidName = async (event: FormEvent) => {
    event.preventDefault();
    if (!kidNameInput.trim()) {
      toast.error("Kid's name cannot be empty.");
      return;
    }
    setIsSettingKidName(true);
    toast.loading("Saving kid's name...");

    try {
      const response = await fetch('/api/user/set-kid-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidName: kidNameInput.trim() }),
      });
      
      toast.dismiss();
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Kid's name saved!");
        await updateSession({ kidName: data.kidName }); // Update session client-side
      } else {
        toast.error(data.message || 'Failed to set kid\'s name.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
      console.error('Set kid name error:', error);
    } finally {
      setIsSettingKidName(false);
    }
  };

  const handleStartChat = async () => {
    if (!session?.user?.kidName) {
      toast.error("Please set your kid's name before starting a chat.");
      return;
    }
    setIsCreatingSession(true);
    toast.loading('Starting new chat session...');

    try {
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceName: selectedVoice,
          languageCode: DEFAULT_LANGUAGE_CODE, // For now, default. Could be part of VoiceSelectionPanel
          // modelName is fixed on the backend for this flow.
        }),
      });
      
      toast.dismiss();
      const data = await response.json();

      if (response.ok && data.sessionId) {
        toast.success('Chat session created! Redirecting...');
        router.push(`/dashboard/chat/${data.sessionId}`);
      } else {
        toast.error(data.message || 'Failed to start chat session.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
      console.error('Start chat error:', error);
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {session?.user?.name || 'Parent'}!</CardTitle>
          <CardDescription>Manage your WonderChat settings and start new conversations.</CardDescription>
        </CardHeader>
        {!session?.user?.kidName ? (
          <CardContent>
            <form onSubmit={handleSetKidName} className="space-y-4 max-w-md">
              <p className="text-lg font-semibold">Set Your Child&apos;s Name</p>
              <p className="text-sm text-muted-foreground">
                This name will be used by the AI to address your child.
              </p>
              <div>
                <Label htmlFor="kidName">Child&apos;s Name</Label>
                <Input
                  id="kidName"
                  type="text"
                  value={kidNameInput}
                  onChange={(e) => setKidNameInput(e.target.value)}
                  placeholder="e.g., Alex"
                  required
                  disabled={isSettingKidName}
                />
              </div>
              <Button type="submit" disabled={isSettingKidName || !kidNameInput.trim()} className="w-full sm:w-auto">
                {isSettingKidName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings2 className="mr-2 h-4 w-4" />}
                Save Child&apos;s Name
              </Button>
            </form>
          </CardContent>
        ) : (
          <CardContent className="space-y-6">
            <div>
              <p className="text-xl font-semibold">
                Start a New Chat as <span className="text-primary">{session.user.kidName}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Choose a voice for the AI companion and begin a new voice chat session.
              </p>
            </div>
            <VoiceSelectionPanel selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
             <p className="text-xs text-muted-foreground">
              Language: {DEFAULT_LANGUAGE_CODE} | Model: {FIXED_MODEL_NAME_CONST.split('-').slice(0,2).join('-') + '-...'}
            </p>
          </CardContent>
        )}
        {session?.user?.kidName && (
           <CardFooter>
            <Button 
              onClick={handleStartChat} 
              disabled={isCreatingSession || !session?.user?.kidName}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isCreatingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
              Start Chat with {session.user.kidName}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Placeholder for future features like chat history */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>Review past conversations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Chat history will be available here soon.</p>
        </CardContent>
      </Card> */}
    </div>
  );
}