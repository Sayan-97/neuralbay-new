import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface DfinityCredentials {
  principal: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "DFINITY",
      credentials: {
        principal: { label: "Principal ID", type: "text" },
      },
      async authorize(credentials) {
        const creds = credentials as DfinityCredentials;

        if (!creds.principal) {
          throw new Error("Missing Principal ID");
        }

        return {
          id: creds.principal, // NextAuth requires an 'id'
          principalId: creds.principal, // Custom field
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = { principalId: token.sub as string };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.principalId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};
