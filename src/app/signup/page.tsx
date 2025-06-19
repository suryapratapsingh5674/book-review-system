"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { login: contextLogin, user } = useAuth(); // Use login to simulate signup & login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSigningUp, startSignupTransition] = useTransition();
  const { toast } = useToast();

  if (user) {
    router.push('/profile'); // Redirect if already logged in
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Signup Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (!username || !password) {
       toast({ title: "Signup Error", description: "Username and password are required.", variant: "destructive" });
      return;
    }

    startSignupTransition(async () => {
      try {
        // In a real app, you'd call a server action to create a new user.
        // For this mock setup, we'll just use the contextLogin to simulate creating an account and logging in.
        contextLogin(username); // This will create a temp user in AuthContext if not exists
        router.push('/profile');
        toast({ title: "Signup Successful!", description: `Welcome to Lyrical Pages, ${username}!` });
      } catch (error) {
        toast({ title: "Signup Error", description: (error as Error).message || "An unexpected error occurred.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-250px)] py-12">
      <Card className="w-full max-w-md shadow-2xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create an Account</CardTitle>
          <CardDescription>Join Lyrical Pages to review and discover books.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username-signup">Username</Label>
              <Input
                id="username-signup"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-signup">Password</Label>
              <Input
                id="password-signup"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password-signup">Confirm Password</Label>
              <Input
                id="confirm-password-signup"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isSigningUp}>
              {isSigningUp ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-5 w-5" />
              )}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
