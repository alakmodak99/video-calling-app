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
import {
  Video,
  Phone,
  Users,
  Copy,
  Share2,
  LogOut,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export function Dashboard() {
  const { user, logout } = useAuth();
  const [callId, setCallId] = useState("");
  const [isCreatingCall, setIsCreatingCall] = useState(false);

  const createNewCall = () => {
    if (callId) return;
    const newCallId = `call_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setCallId(newCallId);
    setIsCreatingCall(true);
  };

  const joinCall = () => {
    if (callId.trim()) {
      window.location.href = `/call/${callId.trim()}`;
    }
  };

  const copyCallLink = () => {
    if (!callId) return;
    const link = `${window.location.origin}/call/${callId}`;
    navigator.clipboard.writeText(link);
    toast.success("Call link copied to clipboard");
  };

  const shareCallLink = () => {
    if (!callId) return;
    const link = `${window.location.origin}/call/${callId}`;
    if (navigator.share) {
      navigator.share({
        title: "Join my video call",
        text: "Join my video call on VideoCall",
        url: link,
      });
    } else {
      copyCallLink();
      toast.success("Call link copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                VideoCall
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name || "Guest"}
                </span>
              </div>
              {/* <ThemeToggle /> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="cursor-pointer hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Start a new call or join an existing one
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create New Call */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Video className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Create New Call
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Start a new video call and invite others to join
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={createNewCall}
                className="w-full cursor-pointer hover:bg-blue-600 hover:text-white"
                size="lg"
              >
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>

              {isCreatingCall && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Call ID
                    </label>
                    <div className="flex space-x-2">
                      <Input value={callId} readOnly className="flex-1" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyCallLink}
                        className="cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={shareCallLink}
                      className="flex-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                    <Button
                      onClick={() => (window.location.href = `/call/${callId}`)}
                      className="flex-1 cursor-pointer hover:bg-blue-600 hover:text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Join Call
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Join Existing Call */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900 dark:text-white">
                <Users className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Join Call
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Enter a call ID to join an existing video call
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Call ID
                </label>
                <Input
                  placeholder="Enter call ID"
                  value={callId}
                  onChange={(e) => setCallId(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                onClick={joinCall}
                className="w-full cursor-pointer hover:bg-blue-600 hover:text-white"
                size="lg"
                disabled={!callId.trim()}
              >
                <Phone className="h-4 w-4 mr-2" />
                Join Call
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              HD Video
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crystal clear video quality for all participants
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multi-User
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Support for multiple participants in one call
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Setup
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simple and intuitive interface for everyone
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
