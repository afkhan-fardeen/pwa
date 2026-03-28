import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // AUTH_SECRET (or legacy NEXTAUTH_SECRET) — required; see .env.example
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        const { verifyCredentials } = await import("@/lib/auth/credentials");
        return verifyCredentials(email, password);
      },
    }),
  ],
});
