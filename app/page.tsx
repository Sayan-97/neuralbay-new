"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Hero from "@/components/containers/hero";
import Features from "@/components/containers/features";
import Discover from "@/components/containers/discover";
import Unlocking from "@/components/containers/unlocking";
import Genesis from "@/components/containers/genesis";
import Unleashing from "@/components/containers/unleashing";
import Distributed from "@/components/containers/distributed";
import MultiLanguage from "@/components/containers/multi-language";
import FAQs from "@/components/containers/faqs";
// Home
export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Discover />
      <Unlocking />
      <Genesis />
      <Unleashing />
      <Distributed />
      <MultiLanguage />
      <FAQs />
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.h1
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to ICP AI Marketplace
          </motion.h1>
          <motion.p
            className="text-xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Discover and deploy cutting-edge AI models on the Internet Computer
            Protocol
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button asChild>
              <Link href="/marketplace">Explore Models</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/vendor/dashboard">Vendor Dashboard</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
