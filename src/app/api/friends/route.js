import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { userEmail, friendEmail } = await req.json();

    // Construct the key for the user
    const userKey = `user:${userEmail}`;

    // Fetch existing user data
    const userDataStr = await kv.get(userKey);
    let userData = JSON.stringify(userDataStr);
    let userDataObj = JSON.parse(userData);

    // Initialize friends array if it doesn't exist
    if (!userDataObj.friends) {
        userDataObj.friends = [];
    } else {
      // Check if the friend is already present in the friends list
      if (userDataObj.friends.includes(friendEmail)) {
        return NextResponse.json(
          { error: "Friend already exists" },
          { status: 400 }
        );
      }
    }

    // Add friend email to friends list if not already present
    if (!userDataObj.friends.includes(friendEmail)) {
        userDataObj.friends.push(friendEmail);
    }

    const userDataStr2 = JSON.stringify(userDataObj);
    // Save the updated user data to Vercel KV
    await kv.set(userKey, userDataStr2);

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in POST function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
