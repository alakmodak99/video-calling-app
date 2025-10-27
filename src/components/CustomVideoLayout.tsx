/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  useCallStateHooks,
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Crown,
  User,
} from "lucide-react";

interface CustomVideoLayoutProps {
  className?: string;
}

export function CustomVideoLayout({ className }: CustomVideoLayoutProps) {
  const { useParticipants, useLocalParticipant } = useCallStateHooks();
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const [hoveredParticipant, setHoveredParticipant] = useState<string | null>(
    null
  );

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

        const isHovered = hoveredParticipant === participant.sessionId;
        const isHost = participant.isLocalParticipant; // Assuming local participant is host

        return (
          <div
            key={participant.sessionId}
            className={`relative bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center group transition-all duration-300 ${
              participant.isSpeaking
                ? "ring-4 ring-blue-500 ring-opacity-80 shadow-2xl shadow-blue-500/30"
                : "hover:ring-2 hover:ring-white/20"
            } ${isHovered ? "scale-105 z-10" : ""}`}
            // onMouseEnter={() => setHoveredParticipant(participant.sessionId)}
            // onMouseLeave={() => setHoveredParticipant(null)}
          >
            <ParticipantView
              participant={participant}
              className="w-full h-full object-cover"
            />

            {/* Enhanced Speaking Indicator */}
            {participant.isSpeaking && (
              <div className="absolute inset-0 ring-4 ring-blue-500 rounded-xl pointer-events-none animate-pulse" />
            )}

            {/* Enhanced Name Badge */}
            <div
              className={`absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isHovered ? "bg-black/90" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                {isHost && <Crown className="h-3 w-3 text-yellow-400" />}
                <span>{participant.name || "Guest"}</span>
                {participant.isLocalParticipant && (
                  <span className="text-blue-300 text-xs">(You)</span>
                )}
              </div>
            </div>

            {/* Enhanced Status Indicators */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Microphone Status */}
              <div
                className={`p-2 rounded-full transition-all duration-200 ${
                  !isMicMuted
                    ? "bg-red-500/90 backdrop-blur-sm"
                    : "bg-green-500/90 backdrop-blur-sm"
                }`}
              >
                {!isMicMuted ? (
                  <MicOff className="h-4 w-4 text-white" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Camera Status */}
              <div
                className={`p-2 rounded-full transition-all duration-200 ${
                  !isCamOff
                    ? "bg-red-500/90 backdrop-blur-sm"
                    : "bg-green-500/90 backdrop-blur-sm"
                }`}
              >
                {!isCamOff ? (
                  <VideoOff className="h-4 w-4 text-white" />
                ) : (
                  <Video className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Volume Indicator */}
              {/* <div className="p-2 rounded-full bg-gray-700/90 backdrop-blur-sm">
                <Volume2 className="h-4 w-4 text-white" />
              </div> */}
            </div>

            {/* Connection Quality Indicator */}
            <div className="absolute top-3 left-3 flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                HD
              </span>
            </div>

            {/* Hover Overlay */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-white text-center">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Click to focus</p>
                </div>
              </div>
            )}

            {/* Participant Count Badge for Grid View */}
            {totalParticipants > 4 && (
              <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {allParticipants.indexOf(participant) + 1}/{totalParticipants}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
