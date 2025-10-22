/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  useCallStateHooks,
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

interface CustomVideoLayoutProps {
  className?: string;
}

export function CustomVideoLayout({ className }: CustomVideoLayoutProps) {
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();

  const combinedParticipants = localParticipant
    ? [localParticipant, ...participants]
    : participants;

  const uniqueParticipantsMap = new Map<string, StreamVideoParticipant>();
  combinedParticipants.forEach((participant) => {
    uniqueParticipantsMap.set(participant.userId, participant);
  });

  const allParticipants = Array.from(uniqueParticipantsMap.values());

  const totalParticipants = allParticipants.length;

  const getGridLayout = () => {
    switch (totalParticipants) {
      case 1:
        return "grid-cols-1 grid-rows-1";
      case 2:
        return "grid-cols-2 grid-rows-1";
      case 3:
      case 4:
        return "grid-cols-2 grid-rows-2";
      case 5:
      case 6:
        return "grid-cols-3 grid-rows-2";
      default:
        return "grid-cols-4 grid-rows-3";
    }
  };

  return (
    <div className={`grid ${getGridLayout()} gap-4 h-full p-4 ${className}`}>
      {allParticipants.map((participant: any) => {
        let isMicMuted = participant.audioStream?.active ?? false;
        let isCamOff = participant.videoStream?.active ?? false;
        if (!participant.isLocalParticipant) {
          isCamOff = participant.publishedTracks?.includes(2) ?? false;
          isMicMuted = participant.publishedTracks?.includes(1) ?? false;
        }

        return (
          <div
            key={participant.sessionId} // Use sessionId for React key as it's unique per connection
            className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <ParticipantView
              participant={participant}
              className="w-full h-full object-cover"
            />

            {participant.isSpeaking && (
              <div className="absolute inset-0 ring-4 ring-blue-500 rounded-lg pointer-events-none" />
            )}

            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-md text-sm font-medium">
              {participant.name || "Guest"}
              {participant.isLocalParticipant && " (You)"}
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-2">
              {!isMicMuted ? (
                <div className="bg-red-500 p-2 rounded-full">
                  <MicOff className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="bg-gray-700 bg-opacity-50 p-2 rounded-full">
                  <Mic className="h-5 w-5 text-white" />
                </div>
              )}
              {!isCamOff ? (
                <div className="bg-red-500 p-2 rounded-full">
                  <VideoOff className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="bg-gray-700 bg-opacity-50 p-2 rounded-full">
                  <Video className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
