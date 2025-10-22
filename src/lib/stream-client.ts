import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { v4 as uuidv4 } from "uuid";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

export const createStreamClient = (
  userId: string,
  userName: string,
  userToken?: string
) => {
  const client = new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: userName,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    },
    token: userToken,
  });

  return client;
};

export const generateUserToken = async (userId: string) => {
  // In a real app, you'd generate this token on your backend
  // For demo purposes, we'll use a simple approach
  const response = await fetch("/api/generate-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate token");
  }

  const { token } = await response.json();
  return token;
};
