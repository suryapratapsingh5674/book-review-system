"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
// import { loginUser as serverLoginAction } from '@/lib/actions'; // If using server action for validation

export default function LoginPage() {
  const router = useRouter();
  const { login: contextLogin, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Password field for UI realism, not used in mock
  const [isLoggingIn, startLoginTransition] = useTransition();
  const { toast } = useToast();

  if (user) {
    router.push('/profile'); // Redirect if already logged in
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast({ title: "Login Error", description: "Please enter a username.", variant: "destructive" });
      return;
    }
    startLoginTransition(async () => {
      try {
        // In a real app, you'd call a server action that validates credentials.
        // For mock:
        // const loggedInUser = await serverLoginAction(username);
        // if (loggedInUser) {
        //   contextLogin(loggedInUser.username); // Update context with the validated user
        //   router.push('/profile');
        //   toast({ title: "Login Successful", description: `Welcome back, ${loggedInUser.username}!` });
        // } else {
        //   toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
        // }
        
        // Simplified context login for this mock setup
        contextLogin(username);
        router.push('/profile');
        toast({ title: "Login Successful", description: `Welcome back, ${username}!` });

      } catch (error) {
        toast({ title: "Login Error", description: (error as Error).message || "An unexpected error occurred.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)] py-12">
      <Card className="w-full max-w-md shadow-2xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Welcome Back!</CardTitle>
          <CardDescription>Log in to continue to Lyrical Pages.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              Log In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
