"use client";

import React from "react";
import { useCallStateHooks, ParticipantView } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ParticipantManagerProps {
  onClose: () => void;
}

export function ParticipantManager({ onClose }: ParticipantManagerProps) {
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  // Filter out local participant from remote participants by user ID
  const remoteParticipants = participants.filter(
    (p) => p.userId !== localParticipant?.userId
  );

  // Further filter to ensure no duplicate user IDs
  const uniqueRemoteParticipants = remoteParticipants.reduce(
    (acc, participant) => {
      const existingParticipant = acc.find(
        (p) => p.userId === participant.userId
      );
      if (!existingParticipant) {
        acc.push(participant);
      }
      return acc;
    },
    [] as typeof remoteParticipants
  );

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 dark:bg-gray-900 border-gray-700 dark:border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Participants (
            {localParticipant
              ? uniqueRemoteParticipants.length + 1
              : uniqueRemoteParticipants.length}
            )
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Local Participant */}
        {localParticipant && (
          <div className="flex items-center justify-between p-3 bg-gray-700 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ParticipantView
                  participant={localParticipant}
                  className="w-10 h-10 rounded-md"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {localParticipant.name || "You"}
                </p>
                <p className="text-gray-400 text-xs">You</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {localParticipant.audioStream?.active ? (
                <Mic className="h-4 w-4 text-green-400" />
              ) : (
                <MicOff className="h-4 w-4 text-red-400" />
              )}
              {localParticipant.videoStream?.active ? (
                <Video className="h-4 w-4 text-green-400" />
              ) : (
                <VideoOff className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        )}

        {/* Remote Participants */}
        {uniqueRemoteParticipants.map((participant) => (
          <div
            key={participant.sessionId}
            className="flex items-center justify-between p-3 bg-gray-700 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ParticipantView
                  participant={participant}
                  className="w-10 h-10 rounded-md"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {participant.name || "Participant"}
                </p>
                <p className="text-gray-400 text-xs">
                  {participant.isSpeaking ? "Speaking" : "Listening"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {participant.audioStream?.active ? (
                <Mic className="h-4 w-4 text-green-400" />
              ) : (
                <MicOff className="h-4 w-4 text-red-400" />
              )}
              {participant.videoStream?.active ? (
                <Video className="h-4 w-4 text-green-400" />
              ) : (
                <VideoOff className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        ))}

        {uniqueRemoteParticipants.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">
              Waiting for others to join...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
