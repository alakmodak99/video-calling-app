"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Video, Users, Shield } from "lucide-react";

export function LoginForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim(), email.trim() || undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500">
            <Video className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to VideoCall
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter your details to start making video calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Display Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email (Optional)
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer hover:bg-blue-600 hover:text-white" size="lg">
              Start Video Calling
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Users className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span>Connect with anyone, anywhere</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Shield className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              <span>Secure and encrypted calls</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
