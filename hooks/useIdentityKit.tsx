"use client";

import { useEffect, useState } from "react";
import { useAgent, useAuth } from "@nfid/identitykit/react";
import { Actor } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "@/declarations/ledger.did";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

const ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

// ✅ Explicit Result Type
type SendResult =
  | { Ok: bigint }
  | { Err: { message: string; code?: number } };

export const useIdentityKit = () => {
  const agent = useAgent({ host: "https://ic0.app" });
  const { user, connect, disconnect, isConnecting } = useAuth();
  const [principalId, setPrincipalId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.principal) {
      setPrincipalId(user.principal.toText());
    } else {
      setPrincipalId(null);
    }
  }, [user]);

  const login = async () => {
    if (isConnecting) {
      console.warn("⏳ IdentityKit is still initializing.");
      return;
    }
    await connect();
  };

  const logout = async () => {
    await disconnect();
  };

  const requestTransfer = async (
    to: string,
    amountICP: number
  ): Promise<SendResult | null> => {
    if (!agent || !user?.principal) {
      console.error("⛔ Agent or principal missing:", { agent, principal: user?.principal });
      alert("Please connect your wallet first.");
      return null;
    }

    try {
      const actor = Actor.createActor(ledgerIDL, {
        agent,
        canisterId: ICP_LEDGER_CANISTER_ID,
      });

      const recipientAccountId = AccountIdentifier.fromPrincipal({
        principal: Principal.fromText(to),
        subAccount: undefined,
      }).toHex();

      const amountE8s = BigInt(Math.floor(amountICP * 100_000_000));
      const feeE8s = BigInt(10_000);

      const result = await actor.send_dfx({
        to: recipientAccountId,
        amount: { e8s: amountE8s },
        fee: { e8s: feeE8s },
        memo: BigInt(0),
        from_subaccount: [],
        created_at_time: [],
      });

      return result; // already a { Ok | Err } structure
    } catch (err) {
      console.error("🔥 Transfer failed:", err);
      return null;
    }
  };

  return {
    isConnected: !!user?.principal,
    principalId,
    login,
    logout,
    requestTransfer,
    isReady: !isConnecting,
  };
};
