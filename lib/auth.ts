import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      console.log("Token:", token);
      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        console.log("Session:", session);
        console.log("Session Exp:", session.expires);
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("Signed In!", message);
    },
    async signOut(message) {
      console.log("Signed Out!", message);
    },
    async createUser(message) {
      console.log("User Created!", message);
    },
  },
} satisfies NextAuthOptions;
