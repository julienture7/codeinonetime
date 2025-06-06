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
    <div className="min-h-screen flex flex-col bg-muted/20 dark:bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://picsum.photos/seed/applogo/32/32" alt="WonderChat Logo" className="h-8 w-8 rounded-full" />
            <span className="font-bold text-lg text-foreground">WonderChat</span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.name} {user.kidName ? `(Parent of ${user.kidName})` : ''}
            </span>
             <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </div>
      </header>
      <nav className="bg-card border-b border-border/40">
        <div className="container max-w-screen-2xl py-2 px-4">
          <ul className="flex space-x-4 text-sm">
            <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary flex items-center"><LayoutDashboard className="w-4 h-4 mr-1"/>Dashboard</Link></li>
             <li><Link to="/dashboard/settings" className="text-muted-foreground hover:text-primary flex items-center"><Settings className="w-4 h-4 mr-1"/>Settings</Link></li>
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
      <footer className="py-6 md:px-8 md:py-0 border-t bg-background">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
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
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account and child's profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="userName">Your Name</Label>
            <Input id="userName" value={user?.name || ''} disabled className="bg-muted/50"/>
          </div>
          <div>
            <Label htmlFor="userEmail">Your Email</Label>
            <Input id="userEmail" value={user?.email || ''} disabled className="bg-muted/50"/>
          </div>
          <div>
            <Label htmlFor="kidName">Child's Name</Label>
            <Input
              id="kidName"
              value={kidNameInput}
              onChange={(e) => setKidNameInput(e.target.value)}
              placeholder="Enter child's name"
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
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
