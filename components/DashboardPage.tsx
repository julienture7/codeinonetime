import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { VoiceSelectionPanel } from './ui/voice-selection-panel';
import { toast } from 'sonner';
import { Loader2, PlayCircle, Settings2 } from 'lucide-react';
import { DEFAULT_VOICE_NAME, DEFAULT_LANGUAGE_CODE, FIXED_MODEL_NAME_CONST } from '../constants'; // Adjusted path
import { useAuth } from '../App'; // Adjusted path

export default function DashboardPage() {
  const { user, setKidName: setAuthKidName, isLoading: authIsLoading } = useAuth();
  const navigate = useNavigate(); // Changed from useHistory

  const [kidNameInput, setKidNameInput] = React.useState('');
  const [isSettingKidName, setIsSettingKidName] = React.useState(false);
  const [isCreatingSession, setIsCreatingSession] = React.useState(false);
  const [selectedVoice, setSelectedVoice] = React.useState(DEFAULT_VOICE_NAME);

  React.useEffect(() => {
    if (user?.kidName) {
      setKidNameInput(user.kidName);
    }
  }, [user]);

  if (authIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  const handleSetKidName = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!kidNameInput.trim()) {
      toast.error("Kid's name cannot be empty.");
      return;
    }
    setIsSettingKidName(true);
    toast.loading("Saving kid's name...");

    // Simulate API call, update context
    setTimeout(() => {
      setAuthKidName(kidNameInput.trim());
      toast.dismiss();
      toast.success("Kid's name saved!");
      setIsSettingKidName(false);
    }, 500);
  };

  const handleStartChat = async () => {
    if (!user?.kidName) {
      toast.error("Please set your kid's name before starting a chat.");
      return;
    }
    setIsCreatingSession(true);
    toast.loading('Starting new chat session...');

    setTimeout(() => {
      toast.dismiss();
      toast.success('Chat session ready! Redirecting...');
      navigate(`/dashboard/chat/mockSession`); // Changed from history.push
    }, 1000);
     setTimeout(() => setIsCreatingSession(false), 1100);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, {user?.name || 'Parent'}!</CardTitle>
          <CardDescription>Manage your WonderChat settings and start new conversations.</CardDescription>
        </CardHeader>
        {!user?.kidName ? (
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
                Start a New Chat as <span className="text-indigo-500">{user.kidName}</span>
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
        {user?.kidName && (
           <CardFooter>
            <Button
              onClick={handleStartChat}
              disabled={isCreatingSession || !user?.kidName}
              size={"lg" as any}
              className="w-full sm:w-auto"
            >
              {isCreatingSession ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
              Start Chat with {user.kidName}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
