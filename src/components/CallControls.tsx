"use client";

import React from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Monitor,
  MonitorOff,
  Phone,
  LogOut
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
    <div className="bg-background/95 backdrop-blur-sm border-t border-border px-4 py-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Microphone Control */}
          <div className="flex flex-col items-center gap-2 group">
            <Button
              variant={isMute ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleMute}
              className={`
                h-12 w-12 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2
                ${
                  isMute
                    ? "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/25"
                    : "bg-secondary hover:bg-secondary/80 shadow-md"
                }
                group-hover:shadow-lg cursor-pointer
              `}
              aria-label={isMute ? "Unmute microphone" : "Mute microphone"}
              title={isMute ? "Unmute microphone" : "Mute microphone"}
            >
              {isMute ? (
                <MicOff className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Mic className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                Microphone
              </p>
              <p
                className={`text-xs font-semibold transition-colors duration-200 ${
                  isMute ? "text-destructive" : "text-foreground"
                }`}
              >
                {isMute ? "Muted" : "On"}
              </p>
            </div>
          </div>

          {/* Video Control */}
          <div className="flex flex-col items-center gap-2 group">
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="icon"
              onClick={toggleVideo}
              className={`
                h-12 w-12 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2
                ${
                  isVideoOff
                    ? "bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/25"
                    : "bg-secondary hover:bg-secondary/80 shadow-md"
                }
                group-hover:shadow-lg cursor-pointer
              `}
              aria-label={isVideoOff ? "Turn on camera" : "Turn off camera"}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <VideoOff className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Video className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                Camera
              </p>
              <p
                className={`text-xs font-semibold transition-colors duration-200 ${
                  isVideoOff ? "text-destructive" : "text-foreground"
                }`}
              >
                {isVideoOff ? "Off" : "On"}
              </p>
            </div>
          </div>

          {/* Screen Share Control */}
          <div className="flex flex-col items-center gap-2 group">
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="icon"
              onClick={toggleScreenShare}
              className={`
                h-12 w-12 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2
                ${
                  isScreenSharing
                    ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                    : "bg-secondary hover:bg-secondary/80 shadow-md"
                }
                group-hover:shadow-lg cursor-pointer
              `}
              aria-label={
                isScreenSharing ? "Stop sharing screen" : "Share screen"
              }
              title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
            >
              {isScreenSharing ? (
                <MonitorOff className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Monitor className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                Screen
              </p>
              <p
                className={`text-xs font-semibold transition-colors duration-200 ${
                  isScreenSharing ? "text-primary" : "text-foreground"
                }`}
              >
                {isScreenSharing ? "Sharing" : "Off"}
              </p>
            </div>
          </div>

          {/* Settings Control */}
          <div className="flex flex-col items-center gap-2 group">
            <Button
              variant="secondary"
              size="icon"
              onClick={onShowSettings}
              className="
                h-12 w-12 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2
                bg-secondary hover:bg-secondary/80 shadow-md group-hover:shadow-lg cursor-pointer
              "
              aria-label="Call settings"
              title="Call settings"
            >
              <Settings className="h-5 w-5 transition-transform duration-200" />
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">
                Settings
              </p>
            </div>
          </div>

          {/* Leave Call Control */}
          <div className="flex flex-col items-center gap-2 group">
            <Button
              variant="destructive"
              size="icon"
              onClick={onLeave}
              className="
                h-12 w-12 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2
                bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/25
                group-hover:shadow-xl
              "
              aria-label="Leave call"
              title="Leave call"
            >
              <LogOut className="h-5 w-5 transition-transform duration-200 cursor-pointer" />
            </Button>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium">Leave</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
