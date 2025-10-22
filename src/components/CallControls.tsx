"use client";

import React from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Settings,
  Monitor,
  MonitorOff,
  LogOut,
} from "lucide-react";

interface CallControlsProps {
  onLeave: () => void;
  onShowSettings: () => void;
}

export function CallControls({ onLeave, onShowSettings }: CallControlsProps) {
  const { useCameraState, useMicrophoneState, useScreenShareState } =
    useCallStateHooks();

  const { camera, isMute: isVideoOff } = useCameraState();
  const { microphone, isMute } = useMicrophoneState();
  const { screenShare, isEnabled: isScreenSharing } = useScreenShareState();

  const toggleMute = async () => await microphone.toggle();
  const toggleVideo = async () => await camera.toggle();
  const toggleScreenShare = async () => await screenShare.toggle();

  return (
    <div className="bg-gray-900 px-6 py-4 border-t border-gray-700">
      <div className="flex items-center justify-between">
        {/* Left Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Audio Control */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant={isMute ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleMute}
              className="rounded-full h-14 w-14 hover:scale-105 transition-transform cursor-pointer"
              aria-label={isMute ? "Unmute microphone" : "Mute microphone"}
              style={{ width: "100%", height: "100%" }}
              title={isMute ? "Unmute microphone" : "Mute microphone"}
            >
              {isMute ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-400">Mic</p>
              <p className="text-sm font-semibold text-gray-200">
                {isMute ? "Off" : "On"}
              </p>
            </div>
          </div>

          {/* Video Control */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full h-14 w-14 hover:scale-105 transition-transform cursor-pointer"
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
              style={{ width: "100%", height: "100%" }}
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <VideoOff className="h-6 w-6" />
              ) : (
                <Video className="h-6 w-6" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-400">Camera</p>
              <p className="text-sm font-semibold text-gray-200">
                {isVideoOff ? "Off" : "On"}
              </p>
            </div>
          </div>
        </div>

        {/* Center Control */}
        <div className="flex items-center justify-center gap-1">
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full h-14 w-14 hover:scale-105 transition-transform cursor-pointer"
            title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
            aria-label={
              isScreenSharing ? "Stop sharing screen" : "Share screen"
            }
            style={{ width: "100%", height: "100%" }}
          >
            {isScreenSharing ? (
              <MonitorOff className="h-6 w-6" />
            ) : (
              <Monitor className="h-6 w-6" />
            )}
          </Button>
          <div className="text-center">
            <p className="text-xs text-gray-400">Share</p>
            <p className="text-sm font-semibold text-gray-200">
              {isScreenSharing ? "On" : "Off"}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center justify-center gap-1">
          {/* Settings Control */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="secondary"
              size="lg"
              onClick={onShowSettings}
              className="rounded-full h-14 w-14 hover:scale-105 transition-transform cursor-pointer"
              title="Call settings"
              aria-label="Call settings"
              style={{ width: "100%", height: "100%" }}
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>

          {/* Leave Control */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="destructive"
              size="lg"
              onClick={onLeave}
              className="rounded-full h-14 w-14 hover:scale-105 transition-transform cursor-pointer"
              title="Leave call"
              aria-label="Leave call"
              style={{ width: "100%", height: "100%" }}
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
