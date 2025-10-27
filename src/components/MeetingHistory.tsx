"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService, Meeting } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Video,
  VideoOff,
  Play,
  Square,
  AlertCircle,
  Loader2,
  Phone,
} from "lucide-react";

interface MeetingHistoryProps {
  limit?: number;
}

export function MeetingHistory({ limit = 10 }: MeetingHistoryProps) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const fetchMeetingHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await apiService.getMeetingHistory(limit);
      setMeetings(history);
    } catch (error) {
      console.error("Failed to fetch meeting history:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load meeting history"
      );
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (user) {
      fetchMeetingHistory();
    }
  }, [user, fetchMeetingHistory]);

  const joinMeeting = (callId: string) => {
    router.push(`/call/${callId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <Square className="h-4 w-4" />;
      case "cancelled":
        return <VideoOff className="h-4 w-4" />;
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting History
          </CardTitle>
          <CardDescription>Your recent video call meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading meetings...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting History
          </CardTitle>
          <CardDescription>Your recent video call meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <span className="text-red-600">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Meeting History
          </CardTitle>
          <CardDescription>Your recent video call meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No meetings yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start your first video call to see it appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Meeting History
        </CardTitle>
        <CardDescription>Your recent video call meetings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {meeting?.title}
                    </h3>
                    {/* <div
                      className={`flex items-center gap-1 text-xs ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      {getStatusIcon(meeting.status)}
                      <span className="capitalize">{meeting.status}</span>
                    </div> */}
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

                    {meeting.startTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(meeting.startTime)}</span>
                      </div>
                    )}

                    {meeting.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(meeting.duration)}</span>
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
                    Hosted by {meeting.host.name}
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

        {meetings.length >= limit && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={fetchMeetingHistory}>
              Load More Meetings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
