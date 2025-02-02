"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async () => {
    // In a real implementation, this would interact with the Internet Identity service
    setIsLoggedIn(true)
    toast.success("Logged in successfully!")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    toast.success("Logged out successfully!")
  }

  return <Button onClick={isLoggedIn ? handleLogout : handleLogin}>{isLoggedIn ? "Logout" : "Login"}</Button>
}

