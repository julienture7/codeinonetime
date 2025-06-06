import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from useHistory
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { useAuth } from '../App'; // Adjusted path

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState(''); // Added for simple login
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate(); // Changed from useHistory
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    toast.loading('Signing in...');

    // Simulate API call
    setTimeout(() => {
      if (email && password && name) { // Basic validation for mock
        login(email, name); // Use name for display, kidName set in dashboard
        toast.dismiss();
        toast.success('Signed in successfully!');
        navigate('/dashboard'); // Changed from history.push
      } else {
        toast.dismiss();
        toast.error('Please fill in all fields.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen marketing-bg-hero-gradient">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold marketing-text-primary">W</span>
              </div>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Welcome to WonderChat</h1>
            <p className="text-white/90 text-lg">Safe AI voice chat for kids</p>
          </div>

          {/* Login Card */}
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-[#111518]">Get Started</CardTitle>
              <CardDescription className="text-[#637c88]">Sign in or create your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#111518] font-medium">Your Name (Parent)</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                    disabled={isLoading}
                    className="mt-1 border-[#dce2e5] focus:marketing-border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#111518] font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="mt-1 border-[#dce2e5] focus:marketing-border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-[#111518] font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="mt-1 border-[#dce2e5] focus:marketing-border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full marketing-btn-primary text-lg font-bold py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Get Started Free'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white/80 text-sm">
              Join thousands of parents who trust WonderChat for their child's development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
