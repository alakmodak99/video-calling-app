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
  try {
    console.log("Generating token for userId:", userId);

    const response = await fetch("/api/generate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    console.log("Token generation response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Token generation error:", errorData);
      throw new Error(errorData.error || "Failed to generate token");
    }

    const { token } = await response.json();
    console.log("Token generated successfully");
    return token;
  } catch (error) {
    console.error("Error in generateUserToken:", error);
    throw error;
  }
};
