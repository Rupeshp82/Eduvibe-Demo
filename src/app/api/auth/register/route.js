import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { email, name, password } = await req.json();

    // Check if the user already exists
    const existingUser = await kv.get(`user:${email}`);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user object
    const user = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      password: hashedPassword,
    };

    // Save the user to Vercel KV
    await kv.set(`user:${email}`, JSON.stringify(user));

    // Return the user object (excluding the password for security reasons)
    return NextResponse.json(
      { email: user.email, name: user.name, id: user.id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
