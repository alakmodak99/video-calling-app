"use client";

import React, { useState, useEffect } from "react";
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
  Calendar,
  Clock,
} from "lucide-react";
import { MeetingHistory } from "@/components/MeetingHistory";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiService, Meeting } from "@/lib/api";

export function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [callId, setCallId] = useState("");
  const [isCreatingCall, setIsCreatingCall] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);

  // Load meetings on component mount
  useEffect(() => {
    if (user) {
      loadMeetings();
    }
  }, [user]);

  const loadMeetings = async () => {
    try {
      setIsLoadingMeetings(true);
      const meetingsData = await apiService.getMeetings();
      setMeetings(meetingsData);
    } catch (error) {
      console.error("Failed to load meetings:", error);
      toast.error("Failed to load meetings");
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const createNewCall = async () => {
    if (callId) return;
    const newCallId = `call_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setCallId(newCallId);
    setIsCreatingCall(true);

    // Create meeting in backend
    try {
      await apiService.createOrGetMeetingByCallId(newCallId, {
        title: `Meeting ${newCallId}`,
        callId: newCallId,
        status: "scheduled",
      });
      await loadMeetings(); // Refresh meetings list
    } catch (error) {
      console.error("Failed to create meeting:", error);
      toast.error("Failed to create meeting");
    }
  };

  const joinCall = () => {
    if (callId.trim()) {
      router.push(`/call/${callId.trim()}`);
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

  const joinMeeting = (meetingCallId: string) => {
    router.push(`/call/${meetingCallId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "text-green-600 dark:text-green-400";
      case "completed":
        return "text-blue-600 dark:text-blue-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      case "scheduled":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-400";
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

          {/* Meeting History */}
          <div className="md:col-span-2">
            <MeetingHistory limit={5} />
          </div>
        </div>

        {/* Recent Meetings Management */}
        {/* {meetings.length > 0 && (
          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Your Meetings
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadMeetings}
                    disabled={isLoadingMeetings}
                    className="cursor-pointer"
                  >
                    {isLoadingMeetings ? "Loading..." : "Refresh"}
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Manage your recent video call meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.slice(0, 5).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {meeting.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                meeting.status
                              )} bg-opacity-20`}
                            >
                              {meeting.status}
                            </span>
                          </div>

                          {meeting.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {meeting.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(meeting.createdAt)}</span>
                            </div>

                            {meeting.duration > 0 && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{meeting.duration}m</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {meeting.participantCount} participant
                                {meeting.participantCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                            Call ID: {meeting.callId}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => joinMeeting(meeting.callId)}
                            className="cursor-pointer"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

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
