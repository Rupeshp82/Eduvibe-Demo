import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { content, userId, email, name } = await req.json();

    // Check if content exists
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Create new post object
    const post = {
      id: Math.random().toString(36).substring(7),
      userId,
      email,
      name,
      content,
      createdAt: new Date().toISOString(),
    };

    // Store list of posts in KV storage not string
    await kv.rpush(`post:${post.userId}`, JSON.stringify(post));

    // Return successful response
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const keys = await kv.keys("post:*");

    const postData = {};

    await Promise.all(
      keys.map(async (key) => {
        const postId = key.split(":")[1];

        const postDataObj = await kv.lrange(key, 0, -1);
        postData[postId] = postDataObj.map((post) => JSON.stringify(post));
      })
    );

    return NextResponse.json(postData, { status: 200 });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
