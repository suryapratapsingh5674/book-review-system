"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('lyricalPagesUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('lyricalPagesUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string) => {
    // In a real app, this would involve an API call.
    // For mock purposes, we'll find a user from mockData or create a temp one.
    let foundUser = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!foundUser) {
      // If user not in mock data, create a temporary one for demo
      foundUser = { id: `temp-${Date.now()}`, username };
    }
    setUser(foundUser);
    localStorage.setItem('lyricalPagesUser', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lyricalPagesUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
