/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamCall,
  CallStatsButton,
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { createStreamClient, generateUserToken } from "@/lib/stream-client";
import { ParticipantManager } from "@/components/ParticipantManager";
import { CustomVideoLayout } from "@/components/CustomVideoLayout";
import { CallControls } from "@/components/CallControls";
import { ArrowLeft, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface VideoCallProps {
  callId: string;
}

export function VideoCall({ callId }: VideoCallProps) {
  const { user } = useAuth();
  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const initializeCall = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Generate user token
        const token = await generateUserToken(user.id);

        // Create Stream client
        const streamClient = createStreamClient(user.id, user.name, token);
        setClient(streamClient);

        // Create or get call
        const streamCall = streamClient.call("default", callId);
        await streamCall.join({ create: true });
        setCall(streamCall);

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing call:", err);
        setError("Failed to join call. Please try again.");
        setIsLoading(false);
      }
    };

    initializeCall();

    return () => {
      if (call) {
        call.leave();
        toast.success("Left call successfully");
      }
    };
  }, [user, callId]);

  const leaveCall = () => {
    if (call) {
      call.leave();
      toast.success("Left call successfully");
    }
    window.location.href = "/";
  };

  const copyCallLink = () => {
    const link = `${window.location.origin}/call/${callId}`;
    navigator.clipboard.writeText(link);
    toast.success("Call link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Error
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => (window.location.href = "/")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!client || !call) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950">
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-700 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/")}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-white font-semibold">
                    Call ID: {callId}
                  </h1>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Connected as {user?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCallLink}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Participants
                </Button>
                <CallStatsButton />
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-gray-900 dark:bg-gray-950">
              <CustomVideoLayout />
            </div>

            {/* Controls */}
            <CallControls
              onLeave={leaveCall}
              onShowSettings={() => setShowSettings(!showSettings)}
            />

            {/* Participants List - Only show when toggled */}
            {showParticipants && (
              <div className="bg-gray-800 dark:bg-gray-900 border-t border-gray-700 dark:border-gray-600 p-4">
                <ParticipantManager
                  onClose={() => setShowParticipants(false)}
                />
              </div>
            )}
          </div>

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-auto bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Call Settings</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSettings(false)}
                    >
                      ×
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Audio Quality</span>
                      <select className="bg-gray-700 text-white px-3 py-1 rounded">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Video Quality</span>
                      <select className="bg-gray-700 text-white px-3 py-1 rounded">
                        <option>HD</option>
                        <option>SD</option>
                        <option>Low</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Auto-mute on join</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Show call timer</span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      onClick={copyCallLink}
                      className="w-full"
                      variant="outline"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Copy Invite Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </StreamCall>
      </StreamVideo>
    </div>
  );
}
