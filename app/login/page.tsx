"use client";

import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

export default function LoginButton() {
  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (authContext?.principal) {
      setIsLoggedIn(true);
      saveUserToDatabase(authContext.principal);
    } else {
      setIsLoggedIn(false);
    }
  }, [authContext?.principal]);


  const handleLogin = async () => {
    if (authContext?.login) {
      await authContext.login();
    }
  };

  const handleLogout = async () => {
    if (authContext?.logout) {
      await authContext.logout();
    }
    toast.success("Logged out successfully!");
  };

  const saveUserToDatabase = async (principalId: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ principalId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save user");
      }
      console.log("User saved successfully:", principalId);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen w-full">
    <Button onClick={isLoggedIn ? handleLogout : handleLogin} className="text-lg px-6 py-3">
      {isLoggedIn ? "Logout" : "Please Login with Dfinity"}
    </Button>
  </div>
  );
}
