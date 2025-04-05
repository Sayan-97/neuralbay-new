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

  const checkConnection = async () => {
    console.log("🔄 Checking Plug connection...");
    if (window.ic?.plug?.isConnected) {
      try {
        const connected = await window.ic.plug.isConnected();
        setIsConnected(connected);
        console.log(`✅ Plug isConnected: ${connected}`);

        if (connected && window.ic.plug.getPrincipal) {
          const principal = await window.ic.plug.getPrincipal();
          const principalText =
            typeof principal === "string" ? principal : principal.toText();
          console.log(`🔑 Principal ID: ${principalText}`);
          setPrincipalId(principalText);
        }
      } catch (error) {
        console.error("❌ Error checking Plug connection:", error);
      }
    } else {
      console.warn("⚠️ Plug wallet not detected or missing methods.");
    }
  };


  const connectPlug = async (): Promise<boolean> => {
    if (!window.ic?.plug?.requestConnect) {
      console.error("❌ Plug wallet is not available or missing methods.");
      alert("Plug wallet is not installed or disabled. Please enable it.");
      return false;
    }

    try {
      console.log("🔄 Attempting to connect to Plug...");
      const connected = await window.ic.plug.requestConnect();
      console.log(`✅ Plug Connected: ${connected}`);
      setIsConnected(connected);

      if (connected && window.ic.plug.getPrincipal) {
        const principal = await window.ic.plug.getPrincipal();
        const principalText =
          typeof principal === "string" ? principal : principal.toText();
        console.log(`🔑 Principal after connection: ${principalText}`);
        setPrincipalId(principalText);
      }

      return connected;
    } catch (error) {
      console.error("❌ Error connecting to Plug wallet:", error);
      alert("Failed to connect to Plug wallet. Please try again.");
      return false;
    }
  };

  const requestTransfer = async (
    to: string,
    amountICP: number
  ): Promise<{ height?: number } | null> => {
    if (!window.ic?.plug?.requestTransfer) {
      console.error("❌ Plug wallet is not available or missing transfer method.");
      alert("Plug wallet is not installed or disabled. Please enable it.");
      return null;
    }

    if (!isConnected) {
      console.warn("⚠️ Wallet is not connected. Attempting to connect...");
      const connected = await connectPlug();
      if (!connected) {
        console.error("❌ Wallet is still not connected after attempting connection.");
        alert("Please connect your Plug wallet to proceed.");
        return null;
      }
    }

    try {
      const amountE8s = Math.floor(amountICP * 100_000_000);
      console.log(`🔄 Attempting transfer of ${amountICP} ICP (${amountE8s} e8s) to ${to}`);

      const response = await window.ic.plug.requestTransfer({
        to,
        amount: amountE8s,
      });

      if (response?.height) {
        console.log(`✅ Transaction successful with height: ${response.height}`);
        return response;
      } else {
        console.warn("⚠️ Transaction not completed or canceled.");
        alert("Transaction was canceled. Please try again.");
        return null;
      }
    } catch (error) {
      console.error("❌ Transaction failed or canceled:", error);
      alert("Transaction failed. Please try again.");
      return null;
    }
  };

  return { isConnected, principalId, connectPlug, requestTransfer };
};
