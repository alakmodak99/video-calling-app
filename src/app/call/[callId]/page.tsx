"use client";

import { use } from "react";
import { VideoCall } from "@/components/VideoCall";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/LoginForm";

interface CallPageProps {
  params: Promise<{
    callId: string;
  }>;
}

export default function CallPage({ params }: CallPageProps) {
  const { user, isLoading } = useAuth();
  const { callId } = use(params);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <VideoCall callId={callId} />;
}
