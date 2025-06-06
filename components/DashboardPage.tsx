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
      {/* Welcome Header with Marketing Style */}
      <div className="text-center mb-12">
        <h1 className="text-[#111518] text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
          Welcome, {user?.name || 'Parent'}! 👋
        </h1>
        <p className="text-[#637c88] text-lg font-normal leading-normal max-w-2xl mx-auto">
          Manage your WonderChat settings and start new conversations with our AI voice assistant designed for children aged 5-10.
        </p>
      </div>

      {!user?.kidName ? (
        /* Setup Card with Marketing Style */
        <Card className="border border-[#dce2e5] shadow-lg marketing-hover-lift transition-all duration-300 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="marketing-text-primary size-16 p-4 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-[#111518] text-2xl font-bold leading-tight">Set Your Child's Profile</CardTitle>
            <CardDescription className="text-[#637c88] text-base">
              Let's personalize the experience for your child. This name will be used by our AI to create a friendly and safe conversation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetKidName} className="space-y-6 max-w-md mx-auto">
              <div>
                <Label htmlFor="kidName" className="text-[#111518] text-base font-medium">Child's Name</Label>
                <Input
                  id="kidName"
                  type="text"
                  value={kidNameInput}
                  onChange={(e) => setKidNameInput(e.target.value)}
                  placeholder="e.g., Alex, Emma, Sam..."
                  required
                  disabled={isSettingKidName}
                  className="mt-2 border-[#dce2e5] focus:marketing-border-primary text-base h-12"
                />
                <p className="text-[#637c88] text-sm mt-2">
                  This helps our AI create a personalized and engaging conversation experience.
                </p>
              </div>
              <Button
                type="submit"
                disabled={isSettingKidName || !kidNameInput.trim()}
                className="w-full marketing-btn-primary text-lg font-bold py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSettingKidName ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Settings2 className="mr-2 h-5 w-5" />}
                Save and Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Chat Setup Card with Marketing Style */
        <div className="grid gap-8 max-w-4xl mx-auto">
          <Card className="border border-[#dce2e5] shadow-lg marketing-hover-lift transition-all duration-300">
            <CardHeader className="text-center">
              <div className="marketing-text-primary size-16 p-4 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-[#111518] text-2xl font-bold leading-tight">
                Ready to Start Chatting with <span className="marketing-text-primary">{user.kidName}</span>?
              </CardTitle>
              <CardDescription className="text-[#637c88] text-base">
                Choose a voice for the AI companion and begin a new voice chat session. Our AI is designed to be educational, fun, and safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-[#111518] text-lg font-medium mb-4">Voice Selection</h3>
                <VoiceSelectionPanel selectedVoice={selectedVoice} onVoiceChange={setSelectedVoice} />
                <div className="mt-4 pt-4 border-t border-[#dce2e5]">
                  <p className="text-[#637c88] text-sm">
                    <strong>Language:</strong> {DEFAULT_LANGUAGE_CODE} | <strong>Model:</strong> {FIXED_MODEL_NAME_CONST.split('-').slice(0,2).join('-') + '-...'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                onClick={handleStartChat}
                disabled={isCreatingSession || !user?.kidName}
                className="marketing-btn-primary text-lg font-bold py-3 px-8 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isCreatingSession ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <PlayCircle className="mr-2 h-6 w-6" />}
                Start Chat with {user.kidName}
              </Button>
            </CardFooter>
          </Card>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border border-[#dce2e5] shadow-md marketing-hover-lift transition-all duration-300">
              <CardContent className="p-6">
                <div className="marketing-text-primary size-12 p-3 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
                  </svg>
                </div>
                <h3 className="text-[#111518] text-lg font-bold mb-2">Safe & Secure</h3>
                <p className="text-[#637c88] text-sm">
                  All conversations are monitored for safety with strict privacy measures and age-appropriate content.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#dce2e5] shadow-md marketing-hover-lift transition-all duration-300">
              <CardContent className="p-6">
                <div className="marketing-text-primary size-12 p-3 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                  <svg fill="currentColor" height="24px" viewBox="0 0 256 256" width="24px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path>
                  </svg>
                </div>
                <h3 className="text-[#111518] text-lg font-bold mb-2">Fun & Educational</h3>
                <p className="text-[#637c88] text-sm">
                  Interactive conversations that promote learning, creativity, and communication skills development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
