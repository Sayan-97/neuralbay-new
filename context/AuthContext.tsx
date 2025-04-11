"use client";

import { createContext, useState, useEffect } from "react";
import { useAuth } from "@nfid/identitykit/react";

interface AuthContextProps {
  identity: Identity | Promise<Identity> | undefined;
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isReady: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, connect, disconnect } = useAuth();
  const [isReady, setIsReady] = useState(false);

  const principal = user?.principal ? user.principal.toText() : null;

  useEffect(() => {
    // we infer IdentityKit is ready if useAuth() has been initialized and returned once
    setIsReady(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        principal,
        login: connect,
        logout: disconnect,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
