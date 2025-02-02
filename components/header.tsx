"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain } from "lucide-react"
import { LoginButton } from "@/components/login-button"
import { motion } from "framer-motion"
import AppLogo from "@/public/app-logo.png"
import Image from "next/image"

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border/50 glossy-bg sticky top-0 z-50"
    >
      <div className="container flex items-center justify-between lg:gap-12 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            {/* <Brain className="h-6 w-6 text-primary" /> */}
            <Image src={AppLogo} alt="img"/>
          </motion.div>
          {/* <span className="text-xl font-bold text-white">ICP AI Marketplace</span> */}
        </Link>
        <nav className="hidden flex-grow md:flex space-x-4">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/vendor/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Vendor Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <form className="hidden md:block">
            <Input
              type="search"
              placeholder="Search models..."
              className="w-[200px] lg:w-[300px] bg-card text-white border-accent"
            />
          </form>
          <LoginButton />
        </div>
      </div>
    </motion.header>
  )
}

