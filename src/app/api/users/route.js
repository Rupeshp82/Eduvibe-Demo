import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req) {
  try {
    const keys = await kv.keys("user:*");

    const userData = {};

    await Promise.all(
      keys.map(async (key) => {
        const userEmail = key.split(":")[1];

        const userDataObj = await kv.get(key);
        userData[userEmail] = userDataObj;
      })
    );

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
