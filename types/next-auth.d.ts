import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    principalId: string;
  }

  interface Session {
    user: {
      principalId: string;
    };
  }

  interface JWT {
    sub: string;
  }
}

