import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
    const apiSecret = process.env.STREAM_API_SECRET!;

    // Generate JWT token for Stream Video SDK
    const payload = {
      user_id: userId,
      iss: apiKey,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
    };

    const token = jwt.sign(payload, apiSecret, { algorithm: 'HS256' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
