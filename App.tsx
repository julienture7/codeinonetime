import * as React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useLocation,
  useParams,
  Outlet
} from 'react-router-dom';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './components/ui/card';
import { Loader2, LogOut, Settings, UserCircle, Sun, Moon, LayoutDashboard, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ChatPageComponent from './components/ChatPage'; // Renamed to avoid conflict

// Marketing Pages
import MarketingLayout from './components/marketing/MarketingLayout';
// MarketingHomePage, MarketingAboutPage etc. will be routed within MarketingLayout

import { DEFAULT_VOICE_NAME, DEFAULT_LANGUAGE_CODE, FIXED_MODEL_NAME_CONST, GEMINI_TEXT_MODEL_NAME } from './constants';
import type { DisplayMessage, ChatConfig } from './types';

// Mock user type
type AppUser = {
  id: string;
  email: string;
  name: string;
  kidName?: string;
};

// Auth Context
interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  setKidName: (kidName: string) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Theme Context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
const ThemeContext = React.createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return storedTheme || 'light';
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = React.useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newUser: AppUser = { id: Date.now().toString(), email, name };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const setKidName = (kidName: string) => {
    setUser(prev => {
      if (prev) {
        const updatedUser = { ...prev, kidName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setKidName }}>
      {children}
    </AuthContext.Provider>
  );
};

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardLayoutRoutes() { // Changed name to avoid conflict if DashboardLayout is a component name
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (theme !== 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    document.body.classList.add('dark', 'bg-background', 'text-foreground');
    return () => {
        document.body.classList.remove('dark', 'bg-background', 'text-foreground');
    }
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success("You've been logged out.");
  };

  if (!user) { // Should be caught by ProtectedRoute, but good for direct access attempt
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dce2e5] shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">W</span>
            </div>
            <span className="font-bold text-xl text-[#111518]">WonderChat</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#637c88] hidden sm:inline font-medium">
              {user.name} {user.kidName ? `(Parent of ${user.kidName})` : ''}
            </span>
             <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="hover:bg-sky-50 marketing-text-primary">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out" className="hover:bg-red-50 text-red-500">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-[#dce2e5]">
        <div className="container max-w-screen-2xl py-3 px-4 md:px-6">
          <ul className="flex space-x-6 text-sm">
            <li>
              <Link to="/dashboard" className="text-[#637c88] hover:marketing-text-primary flex items-center font-medium transition-colors">
                <LayoutDashboard className="w-4 h-4 mr-2"/>Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings" className="text-[#637c88] hover:marketing-text-primary flex items-center font-medium transition-colors">
                <Settings className="w-4 h-4 mr-2"/>Settings
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8 container max-w-screen-2xl">
        <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="chat/:sessionId" element={<ChatPageWrapper />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-[#637c88] md:text-left">
            &copy; {new Date().getFullYear()} WonderChat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function SettingsPage() {
  const { user, setKidName } = useAuth();
  const [kidNameInput, setKidNameInput] = React.useState(user?.kidName || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setKidName(kidNameInput);
    setTimeout(() => {
      toast.success("Kid's name updated!");
      setIsSaving(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Settings Header with Marketing Style */}
      <div className="text-center mb-12">
        <h1 className="text-[#111518] text-4xl font-bold leading-tight tracking-[-0.015em] mb-4">
          Account Settings ⚙️
        </h1>
        <p className="text-[#637c88] text-lg font-normal leading-normal max-w-2xl mx-auto">
          Manage your account information and update your child's profile settings.
        </p>
      </div>

      <Card className="border border-[#dce2e5] shadow-lg marketing-hover-lift transition-all duration-300 max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="marketing-text-primary size-16 p-4 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="h-8 w-8" />
          </div>
          <CardTitle className="text-[#111518] text-2xl font-bold leading-tight">Profile Settings</CardTitle>
          <CardDescription className="text-[#637c88] text-base">
            Update your account details and personalize your child's experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="userName" className="text-[#111518] text-base font-medium">Your Name (Parent)</Label>
                <Input
                  id="userName"
                  value={user?.name || ''}
                  disabled
                  className="mt-2 bg-slate-50 border-[#dce2e5] text-base h-12 text-[#637c88]"
                />
                <p className="text-[#637c88] text-sm mt-1">This information cannot be changed.</p>
              </div>

              <div>
                <Label htmlFor="userEmail" className="text-[#111518] text-base font-medium">Email Address</Label>
                <Input
                  id="userEmail"
                  value={user?.email || ''}
                  disabled
                  className="mt-2 bg-slate-50 border-[#dce2e5] text-base h-12 text-[#637c88]"
                />
                <p className="text-[#637c88] text-sm mt-1">This information cannot be changed.</p>
              </div>

              <div>
                <Label htmlFor="kidName" className="text-[#111518] text-base font-medium">Child's Name</Label>
                <Input
                  id="kidName"
                  value={kidNameInput}
                  onChange={(e) => setKidNameInput(e.target.value)}
                  placeholder="Enter your child's name"
                  className="mt-2 border-[#dce2e5] focus:marketing-border-primary text-base h-12"
                />
                <p className="text-[#637c88] text-sm mt-1">
                  This name will be used by our AI to create personalized conversations.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full marketing-btn-primary text-lg font-bold py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Settings className="mr-2 h-5 w-5" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ChatPageWrapper() {
  const { user } = useAuth();
  const { sessionId } = useParams<{ sessionId: string }>(); // Get sessionId from URL params

  if (!user || !user.kidName) {
    toast.error("Please set your kid's name in the dashboard or settings first.");
    return <Navigate to="/dashboard" replace />;
  }

  const mockChatConfig: ChatConfig = {
    voiceName: DEFAULT_VOICE_NAME,
    languageCode: DEFAULT_LANGUAGE_CODE,
    modelName: FIXED_MODEL_NAME_CONST,
  };

  const initialMessages: DisplayMessage[] = [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hi ${user.kidName}! I'm ready to chat. What would you like to talk about?`,
      createdAt: new Date()
    }
  ];

  return (
    <ChatPageComponent // Use renamed import
      sessionId={sessionId || "mockSession123"} // Use sessionId from params or fallback
      userId={user.id}
      kidName={user.kidName}
      initialMessages={initialMessages}
      chatConfig={mockChatConfig}
    />
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-white text-slate-800">
      <img src="https://picsum.photos/seed/error404/150/150" alt="Confused robot" className="w-40 h-40 mb-8 rounded-full shadow-lg"/>
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-slate-600 mb-8 max-w-md">
        It seems the page you're looking for has wandered off into the digital wilderness.
      </p>
      <Button asChild size="lg" className="marketing-btn-primary">
        <Link to="/">
          Back to Homepage
        </Link>
      </Button>
    </div>
  );
}


// Main App Component
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <DashboardLayoutRoutes />
              </ProtectedRoute>
            } />
            <Route path="/*" element={<MarketingLayout />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
