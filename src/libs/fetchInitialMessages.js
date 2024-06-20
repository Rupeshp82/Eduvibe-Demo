"use client";
import { kv } from "@vercel/kv";

export async function fetchInitialMessages(roomId) {
  const messages = await kv.lrange(`room:${roomId}`, 0, -1);
  return messages.map(JSON.parse);
}
