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
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="https://picsum.photos/seed/applogo/80/80" alt="WonderChat Logo" className="w-20 h-20 mx-auto mb-4 rounded-full" />
          <CardTitle className="text-2xl font-bold">Welcome to WonderChat!</CardTitle>
          <CardDescription>Sign in or create a mock account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name (Parent)</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In / Register (Mock)'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
