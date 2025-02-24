"use client";

import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

export function LoginButton() {
  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (authContext?.principal) {
      setIsLoggedIn(true);
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

  return (
    <Button onClick={isLoggedIn ? handleLogout : handleLogin}>
      {isLoggedIn ? "Logout" : "Login"}
    </Button>
  );
}
