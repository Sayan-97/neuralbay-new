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
import { usePlug } from "@/hooks/usePlug"; // Import Plug Wallet hook
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../../declarations/custom_greeting_backend";

export default function PublishNewModelPage() {
  const router = useRouter();
  const { principal } = useContext(AuthContext) || {};  
  const { principalId } = usePlug(); // Get principal ID from Plug Wallet
  const [isLoading, setIsLoading] = useState(false);

  const agent = new HttpAgent({ host: "https://ic0.app" });


  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiEndpoint: "",
    image: "",
    wallet_principal_id: principalId || "", // Auto-fill if Plug Wallet is connected
  });

  useEffect(() => {
    if (!principal) {
      router.push("/login");
    }
  }, [principal]);

  useEffect(() => {
    if (principalId) {
      setModelData((prev) => ({ ...prev, wallet_principal_id: principalId }));
    }
  }, [principalId]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setModelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: any) => {
    setModelData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    if (!principal) {
      router.push("/login");
      return;
    }

    if (!modelData.wallet_principal_id) {
      toast.error("❌ Please enter a valid Principal ID for receiving payments.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/vendor/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": principal,
        },
        body: JSON.stringify({
          name: modelData.name,
          description: modelData.description,
          category: modelData.category,
          price: modelData.price,
          apiEndpoint: modelData.apiEndpoint,
          image: modelData.image || "https://picsum.photos/seed/model4/400/300",
          wallet_principal_id: modelData.wallet_principal_id, // ✅ Include wallet principal ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish model");
      }

      const result = await response.json();
      console.log("Model published to API:", result);


      toast.success("✅ Model published successfully!");

      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("❌ Error publishing model:", error);
      toast.error("Failed to publish model. Please try again.");
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
          <Input
            id="wallet_principal_id"
            name="wallet_principal_id"
            value={modelData.wallet_principal_id}
            onChange={handleInputChange}
            required
            placeholder="Enter Principal ID"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">Model Image URL (Optional)</label>
          <Input
            id="image"
            name="image"
            value={modelData.image}
            onChange={handleInputChange}
            placeholder="Enter image URL or leave empty for default"
          />
        </div>
        <div>
          <label htmlFor="apiEndpoint" className="block text-sm font-medium mb-1">API Endpoint</label>
          <Input id="apiEndpoint" name="apiEndpoint" value={modelData.apiEndpoint} onChange={handleInputChange} required />
        </div>
        <Button type="submit" className="w-full">
          {isLoading ? "Publishing..." : "Publish Model"}
        </Button>
      </motion.form>
    </motion.div>
  );
}
