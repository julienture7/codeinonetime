
'use client';
import React, { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button'; // Corrected relative path
import { Input } from '../../../components/ui/input';   // Corrected relative path
import { Label } from '../../../components/ui/label';   // Corrected relative path
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'; // Corrected relative path
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    toast.loading('Signing in...');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      toast.dismiss();
      if (result?.error) {
        toast.error(result.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success('Signed in successfully!');
        router.push('/dashboard');
      } else {
         toast.error('An unknown error occurred during sign in.');
         setIsLoading(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred. Please try again.');
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    // This assumes you have a registration page or a modal logic.
    // For simplicity, this example doesn't include a separate registration page,
    // but you would typically navigate to '/register' or open a registration modal.
    // For now, let's pretend we have an API for registration and users register elsewhere or via a different flow.
    // In a real app, you'd navigate to your registration page.
    alert("Please implement a registration page/flow and navigate there. For now, use existing credentials if you have them, or create a user directly in the database for testing.");
    // router.push('/register'); // If you have a register page
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img src="/logo.png" alt="WonderChat Logo" className="w-20 h-20 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Welcome Back to WonderChat!</CardTitle>
          <CardDescription>Sign in to continue to your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" onClick={handleRegisterRedirect} className="p-0 h-auto font-semibold text-primary">
              Register here
            </Button>
            <br/>
            <span className="text-xs">(Registration API: /api/register)</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}