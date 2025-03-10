"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../../declarations/custom_greeting_backend";
import { AuthContext } from "@/context/AuthContext";

export default function EditModelPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const { principal } = useContext(AuthContext) || {};  // No more `login` here
  

  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiEndpoint: "",
    modelImg: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchModelData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const fetchModelData = async () => {
    if (!params.id) {
      setError("Invalid Model ID.");
      return;
    }
  
    if (!principal) {
      setError("Unauthorized: User not logged in.");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3001/api/vendor/models/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": principal, // Ensure principal is passed correctly
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setModelData(data);
    } catch (error) {
      console.error("Error fetching model data:", error);
      toast.error(`Failed to fetch model data: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  

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

    try {
      const response = await fetch(`http://localhost:3001/api/vendor/models/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
      });

      if (!response.ok) {
        throw new Error("Failed to update model");
      }

       toast.success("Model updated successfully!");
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("Error updating model:", error);
      toast.error("Failed to update model. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="container mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="text-3xl font-bold mb-6">
        Edit Model: {modelData.name}
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
          <Select onValueChange={handleSelectChange} defaultValue={modelData.category}>
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
          {isLoading ? "Updating..." : "Update Model"}
        </Button>
      </motion.form>
    </motion.div>
  );
}
