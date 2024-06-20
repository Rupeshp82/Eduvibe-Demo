import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { kv } from "@vercel/kv";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // Check if the user exists
        const user = await kv.get(`user:${email}`);
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare the password
        let userData;
        if (typeof user === "string") {
          userData = JSON.parse(user);
        } else if (typeof user === "object") {
          userData = user;
        } else {
          throw new Error("Unexpected user data type");
        }
        const { password: hashedPassword, ...rest } = userData;
        const valid = await compare(password, hashedPassword);

        if (!valid) {
          throw new Error("Invalid email or password");
        }

        return rest;
      },
    }),
  ],
  session: {
    jwt: true, // Enable JSON Web Token (JWT) for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      const userData = await kv.get(`user:${token.email}`);
      const userObj = Object.assign({}, userData);
      session.user = userObj;
      // return token;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
