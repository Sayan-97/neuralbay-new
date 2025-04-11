"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";
import { useIdentityKit } from "@/hooks/useIdentityKit";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as brokerIDL } from "../../../../declarations/broker";

const BROKER_CANISTER_ID = "ckv2v-waaaa-aaaal-qsmbq-cai"; 

declare global {
  interface Window {
    ic: any;
  }
}

export default function PublishNewModelPage() {
  const router = useRouter();
  const { principal } = useContext(AuthContext) || {};
  const [isLoading, setIsLoading] = useState(false);
  const { principalId, requestTransfer, isReady, login } = useIdentityKit();


  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiEndpoint: "",
    image: "",
    wallet_principal_id: "",
  });

  useEffect(() => {
    if (principalId) {
      setModelData((prev) => ({
        ...prev,
        wallet_principal_id: principalId,
      }));
    }
  }, [principalId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setModelData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!principalId || !isReady) {
      toast.error("🔒 Wallet not connected or still initializing.");
      return;
    }
  
    try {
      const payloadSize = new Blob([JSON.stringify(modelData)]).size;
  
      // Calculate required cycles and ICP
      const cyclesPerByte = 200_000;
      const requiredCycles = payloadSize * cyclesPerByte;
      const icpE8s = Math.ceil(requiredCycles / 10_000); // cycles / 10,000 = e8s
      const icpAmount = icpE8s / 100_000_000;
  
      console.log("📦 Payload size:", payloadSize, "bytes");
      console.log("💰 Required cycles:", requiredCycles);
      console.log("🧮 Required ICP (e8s):", icpE8s);
      console.log("💸 Decimal ICP:", icpAmount);
  
      // ✅ Setup broker actor
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      const broker = Actor.createActor(brokerIDL, {
        agent,
        canisterId: BROKER_CANISTER_ID,
      });
  
      // ✅ Check for existing pending payment
      const pendingPayments = await broker.getAllConfirmedPayments() as Array<[string, bigint]>;

      const hasPending = pendingPayments.find(
        ([payer]: [string, bigint]) => payer.toString() === principalId
      );
  
      if (!hasPending) {
        // ✅ Send ICP using IdentityKit (Ledger)
        const transferResult = await requestTransfer(BROKER_CANISTER_ID, icpAmount);
        if (typeof transferResult !== "bigint") {
          toast.error("Transfer failed. Please try again.");
          return;
        }
        
        // ✅ Confirm payment in broker canister
        const confirm = await broker.confirmPayment(BigInt(icpE8s));
        console.log("✅ Payment confirmed:", confirm);
      } else {
        toast("💡 You already paid for this model. Resuming publish...");
      }
  
      // ✅ Store model
      const result = await broker.storeModel(
        modelData.name,
        modelData.description,
        modelData.category,
        modelData.price,
        modelData.apiEndpoint,
        modelData.image,
        modelData.wallet_principal_id,
        BigInt(payloadSize),
        principalId
      );
  
      console.log("🚀 Model stored:", result);
      toast.success("✅ Model published successfully!");
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("❌ Error publishing model:", error);
      toast.error("Something went wrong during model publishing.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-3xl font-bold mb-6">
        Publish New Model
      </motion.h1>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto glossy-card p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Model Name</label>
          <Input id="name" name="name" value={modelData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <Textarea id="description" name="description" value={modelData.description} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image Generation</SelectItem>
              <SelectItem value="text">Text Processing</SelectItem>
              <SelectItem value="audio">Audio Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">Price (ICP)</label>
          <Input id="price" name="price" type="number" step="0.01" value={modelData.price} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="wallet_principal_id" className="block text-sm font-medium mb-1">Wallet Principal ID</label>
          <Input id="wallet_principal_id" name="wallet_principal_id" value={modelData.wallet_principal_id} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">Model Image URL</label>
          <Input id="image" name="image" value={modelData.image} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="apiEndpoint" className="block text-sm font-medium mb-1">API Endpoint</label>
          <Input id="apiEndpoint" name="apiEndpoint" value={modelData.apiEndpoint} onChange={handleInputChange} required />
        </div>
        <Button type="submit" className="w-full">{isLoading ? "Publishing..." : "Publish Model"}</Button>
      </motion.form>
    </motion.div>
  );
}
