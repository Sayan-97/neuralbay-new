"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@nfid/identitykit/react";

interface AuthContextProps {
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, connect, disconnect } = useAuth();

  const principal = user?.principal ? user.principal.toText() : null;

  return (
    <AuthContext.Provider value={{ principal, login: connect, logout: disconnect }}>
      {children}
    </AuthContext.Provider>
  );
};
