"use client";

import { useIdentityKit } from "@/hooks/useIdentityKit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { useBalance } from "@nfid/identitykit/react";

export function LoginButton() {
  const { isConnected, principalId, login, logout, isReady } = useIdentityKit();
  const { balance, fetchBalance } = useBalance();

  // Call fetchBalance() once user is connected
  useEffect(() => {
    if (isConnected) fetchBalance?.();
  }, [isConnected]);
  
  console.log("💰 Balance:", balance, "ICP");

  const handleLogin = async () => {
    if (!isReady) {
      toast.error("Please wait... IdentityKit is initializing.");
      return;
    }
    await login();
  };
  

  const handleLogout = async () => {
    await logout?.();
    toast.success("Logged out successfully!");
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected && principalId && (
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
          {principalId}
        </span>
      )}
     <Button onClick={isConnected ? handleLogout : handleLogin} disabled={!isReady}>
  {isConnected ? "Logout" : isReady ? "Connect Wallet" : "Initializing..."}
</Button>

    </div>
  );
}
