import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req, context) {
  const { params } = context;
  const roomId = params.id.toString();

  try {
    // Fetch message history from Redis
    const messages = await kv.lrange(`chatMessages:${roomId}`, 0, -1);
    const messageString = JSON.stringify(
      messages.map((message) => JSON.parse(message))
    );
    return NextResponse.json(messageString);
  } catch (error) {
    console.error("Error fetching message history:", error);
    // Handle potential errors during message retrieval (optional)
    return NextResponse.json([], { status: 500 }); // Return empty array with error status
  }
}

export async function POST(req, context) {
  const { userId, message } = await req.json();
  const { params } = context;
  const roomId = params.id.toString();
  const newMessage = { userId, message, timestamp: Date.now() };

  await kv.rpush(`chatMessages:${roomId}`, JSON.stringify(newMessage));

  return NextResponse.json(newMessage, { status: 201 });
}
