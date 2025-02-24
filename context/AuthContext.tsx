"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";

interface AuthContextProps {
  principal: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        setPrincipal(identity.getPrincipal().toString());
      }
      setLoading(false);
    }

    initAuth();
  }, []);

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize", // Ensure this is correct
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setPrincipal(identity.getPrincipal().toString());
          console.log("Login successful!");
          console.log(identity.getPrincipal().toString());
        },
        onError: (error) => {
          console.error("Login failed", error);
        },
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setPrincipal(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider value={{ principal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
