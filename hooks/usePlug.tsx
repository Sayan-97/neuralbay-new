"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define types for Plug wallet methods
interface PlugWallet {
  isConnected?: () => Promise<boolean>;
  requestConnect?: () => Promise<boolean>;
  getPrincipal?: () => Promise<{ toText: () => string } | string>;
  requestTransfer?: (params: {
    to: string;
    amount: number;
  }) => Promise<{ height?: number } | null>;
}

declare global {
  interface Window {
    ic?: {
      plug?: PlugWallet;
    };
  }
}

export const usePlug = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [principalId, setPrincipalId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkConnection = async () => {
      console.log("Checking Plug connection...");
      if (window.ic?.plug?.isConnected) {
        try {
          const connected = await window.ic.plug.isConnected();
          console.log("Is Connected:", connected);
          setIsConnected(connected);

          if (connected && window.ic.plug.getPrincipal) {
            const principal = await window.ic.plug.getPrincipal();
            const principalText =
              typeof principal === "string" ? principal : principal.toText();
            console.log("Principal:", principalText);
            setPrincipalId(principalText);
          }
        } catch (error) {
          console.error("Error checking Plug connection:", error);
        }
      } else {
        console.warn("Plug wallet not detected or missing methods.");
      }
    };

    checkConnection();
  }, []);

  const connectPlug = async () => {
    if (window.ic?.plug?.requestConnect) {
      try {
        const connected = await window.ic.plug.requestConnect();
        console.log("Connected:", connected);
        setIsConnected(connected);

        if (connected && window.ic.plug.getPrincipal) {
          const principal = await window.ic.plug.getPrincipal();
          const principalText =
            typeof principal === "string" ? principal : principal.toText();
          console.log("Principal after connection:", principalText);
          setPrincipalId(principalText);
        }
      } catch (error) {
        console.error("Error connecting to Plug wallet:", error);
      }
    } else {
      console.error("Plug wallet not available or missing methods.");
    }
  };

  const requestTransfer = async (
    to: string,
    amountICP: number
  ): Promise<{ height?: number } | null> => {
    if (!window.ic?.plug?.requestTransfer) {
      console.error("Plug wallet is not available or missing transfer method.");
      return null;
    }

    try {
      const amountE8s = Math.floor(amountICP * 100_000_000); // Convert ICP to e8s
      console.log(
        `Attempting transfer of ${amountICP} ICP (${amountE8s} e8s) to ${to}`
      );

      const response = await window.ic.plug.requestTransfer({
        to,
        amount: amountE8s,
      });

      if (response?.height) {
        console.log("Transaction successful with height:", response.height);
        return response;
      } else {
        console.warn("Transaction not completed or canceled.");
        return null;
      }
    } catch (error) {
      console.error("Transaction failed or canceled:", error);
      return null;
    }
  };

  return { isConnected, principalId, connectPlug, requestTransfer };
};
