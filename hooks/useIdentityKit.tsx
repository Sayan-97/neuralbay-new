"use client";

import { useEffect, useState } from "react";
import { useAgent } from "@nfid/identitykit/react";
import { useAuth } from "@nfid/identitykit/react";
import { Actor } from "@dfinity/agent";
import { idlFactory as ledgerIDL } from "@/declarations/ledger.did";
import { AccountIdentifier } from "@dfinity/ledger-icp";
import { Principal } from "@dfinity/principal";

const ICP_LEDGER_CANISTER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai"; // Replace with dev ledger in testing

export const useIdentityKit = () => {
  const agent = useAgent({ host: "https://ic0.app" }); // ✅ critical fix
  const { user, connect, disconnect } = useAuth();
  const [principalId, setPrincipalId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.principal) {
      setPrincipalId(user.principal.toText());
    } else {
      setPrincipalId(null);
    }
  }, [user]);



  const requestTransfer = async (to: string, amountICP: number) => {
    if (!agent || !user?.principal) {
      console.error("⛔ Agent or principal missing:", { agent, principal: user?.principal });
      alert("Please connect your wallet first.");
      return null;
    }
  
    try {
      console.log("⚙️ Creating Ledger Actor...");
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
  
      console.log("📤 Sending to Account:", recipientAccountId);
  
      const result = await actor.send_dfx({
        to: recipientAccountId,
        amount: { e8s: amountE8s },
        fee: { e8s: feeE8s },
        memo: BigInt(0),
        from_subaccount: [],
        created_at_time: [],
      });
  
      console.log("✅ Transfer result:", result);
      return result;
    } catch (err) {
      console.error("🔥 Transfer failed:", err);
      return null;
    }
  };
  

  return {
    isConnected: !!user?.principal,
    principalId,
    login: connect,
    logout: disconnect,
    requestTransfer,
  };
};

