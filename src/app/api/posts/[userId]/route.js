import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req, context) {
  try {
    const { params } = context;
    const userId = params.userId.toString();
    let posts = [];
    if (!userId) {
      return NextResponse.json(
        { error: "User id is required" },
        { status: 400 }
      );
    }

    // Get all posts from KV storage "post:{userId}"
    posts = await kv.lrange(`post:${userId}`, 0, -1);
    posts = posts.map((post) => JSON.stringify(post));
    posts = posts.reverse();
    posts = posts.map((post) => JSON.parse(post));

    // Return posts
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
