"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, email?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem("video-call-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (name: string, email?: string) => {
    const existingUser = localStorage.getItem("video-call-user");
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);
      if (parsedUser.name === name) {
        setUser(parsedUser);
        return;
      }
    }

    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newUser: User = {
      id: userId,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    };

    setUser(newUser);
    localStorage.setItem("video-call-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("video-call-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
