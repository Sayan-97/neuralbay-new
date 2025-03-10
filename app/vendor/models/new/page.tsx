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
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../../declarations/custom_greeting_backend";

export default function PublishNewModelPage() {
  const router = useRouter();
  const { principal } = useContext(AuthContext) || {};  // No more `login` here
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState([]);

  const canisterId = "ezvoz-kqaaa-aaaal-qnbpq-cai";
  const agent = new HttpAgent({ host: "https://ic0.app" });
  const backendActor = Actor.createActor(idlFactory, { agent, canisterId });

  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiEndpoint: "",
    modelImg: "",
  });

  useEffect(() => {
    if (!principal) {
      router.push("/login");  // 🚀 Redirect user to login page if not authenticated
    }
  }, [principal]);



  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setModelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: any) => {
    setModelData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    if (!principal) {
      router.push("/login");  // 🚀 Redirect before submitting
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
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish model");
      }

      const result = await response.json();
      console.log("Model published to API:", result);

      // Upload to backend canister
      const canisterResponse = await backendActor.addModel(
        modelData.name,
        modelData.apiEndpoint,
        principal
      );

      console.log("Canister response:", canisterResponse);
      toast.success("Model published successfully!");

      // Fetch updated models list

      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("Error publishing model:", error);
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
