import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { isStaffRole } from "@/lib/auth/roles";

const publicPaths = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/install",
]);

function isPublicPath(pathname: string) {
  if (publicPaths.has(pathname)) return true;
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/cron")) return true;
  return false;
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      if (
        pathname.startsWith("/_next") ||
        pathname === "/manifest.webmanifest" ||
        pathname === "/sw.js"
      ) {
        return true;
      }

      if (isPublicPath(pathname)) {
        // Only bounce logged-in users away from sign-in / sign-up — not forgot/reset password
        // (members open "Reset password" from profile while signed in; staff may use links too).
        if (
          auth?.user &&
          (pathname === "/login" || pathname === "/register")
        ) {
          const url = request.nextUrl.clone();
          url.pathname = isStaffRole(auth.user.role) ? "/dashboard" : "/";
          return NextResponse.redirect(url);
        }
        return true;
      }

      if (!auth?.user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }

      const { role } = auth.user;

      if (role === "MEMBER" && pathname.startsWith("/dashboard")) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      if (isStaffRole(role) && !pathname.startsWith("/dashboard")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.halqa = user.halqa;
        token.genderUnit = user.genderUnit;
        token.language = user.language;
        token.status = user.status;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.halqa = token.halqa as typeof session.user.halqa;
        session.user.genderUnit = token.genderUnit as typeof session.user.genderUnit;
        session.user.language = token.language as typeof session.user.language;
        session.user.status = token.status as typeof session.user.status;
      }
      return session;
    },
  },
};
