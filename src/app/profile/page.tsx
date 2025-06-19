"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { User } from '@/lib/types';
import { getUserProfile } from '@/lib/actions'; // Assuming you might fetch more profile data
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Mail, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (authUser) {
        // In a real app, you might fetch more detailed profile data here using authUser.id
        // For now, just use the authUser object or simulate a fetch.
        const fetchProfile = async () => {
          setIsLoading(true);
          // const detailedProfile = await getUserProfile(authUser.id);
          // setProfileData(detailedProfile || authUser); 
          // Using authUser directly as getUserProfile returns from limited mockUsers
          setProfileData(authUser);
          setIsLoading(false);
        };
        fetchProfile();
      } else {
        setIsLoading(false); // No user, not loading
      }
    }
  }, [authUser, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <Card className="max-w-md mx-auto mt-10 shadow-lg">
        <CardHeader className="text-center">
          <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline">Access Denied</CardTitle>
          <CardDescription>You need to be logged in to view this page.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-headline font-bold text-primary mb-8 text-center">Your Profile</h1>
      <Card className="shadow-xl">
        <CardHeader className="items-center text-center">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
            <AvatarImage src={`https://avatar.vercel.sh/${profileData.username}.png`} alt={profileData.username} data-ai-hint="profile avatar large" />
            <AvatarFallback className="text-3xl">{profileData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-headline">{profileData.username}</CardTitle>
          {/* <CardDescription>Your personal Lyrical Pages space.</CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center space-x-3 p-3 bg-secondary rounded-md">
            <UserIcon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="text-lg font-medium">{profileData.username}</p>
            </div>
          </div>
          
          {/* Example for other fields if they were present */}
          {/* <div className="flex items-center space-x-3 p-3 bg-secondary rounded-md">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{profileData.email || 'Not provided'}</p>
            </div>
          </div> */}

          <p className="text-sm text-muted-foreground text-center pt-4">
            Profile editing functionality is not yet available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
