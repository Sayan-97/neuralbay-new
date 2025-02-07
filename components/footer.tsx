"use client";

import { Brain } from "lucide-react";
import { motion } from "framer-motion";
import AppLogo from "@/public/app-logo.png";
import Image from "next/image";
export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-t border-border/50 glossy-bg"
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-start">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {/* <Brain className="h-6 w-6 text-primary" /> */}
            <Image src={AppLogo} alt="img" />
          </motion.div>
          <p className="text-center text-sm leading-loose md:text-left">
            Built on the Internet Computer Protocol. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.a
            href="#"
            className="text-sm underline hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Terms of Service
          </motion.a>
          <motion.a
            href="#"
            className="text-sm underline hover:text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Privacy Policy
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}
