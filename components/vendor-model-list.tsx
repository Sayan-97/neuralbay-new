"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { Trash } from "lucide-react";
import { toast } from "sonner"; // ✅ Toast notifications for feedback

interface Model {
  _id: string;  
  name: string;
  status: string;
  category: string;
  price: string;
  apiCalls: number;
  revenue: number;
}

export function VendorModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { principal } = useContext(AuthContext) || {}; 

  useEffect(() => {
    if (principal) {
      fetchModels();
    }
  }, [principal]); // Fetch models only after principal is available

  const fetchModels = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/vendor/models", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": principal as string, // Ensure it's a string
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }

      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to load models. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (modelId: string) => {
    if (!window.confirm("Are you sure you want to delete this model? This action cannot be undone.")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/vendor/models/${modelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": principal || "", // Ensure user ID is passed
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.status}`);
      }

      toast.success("Model deleted successfully!");
      setModels(models.filter((model) => model._id !== modelId)); // ✅ Remove deleted model from UI
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading your models...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Your Models</h2>
      {models.length === 0 ? (
        <div className="text-center text-gray-500">No models found. Try adding a new one!</div>
      ) : (
        <div className="bg-card/50 rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>API Calls</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model, index) => (
                <motion.tr
                  key={model._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>
                    <Badge variant={model.status === "Live" ? "default" : "secondary"}>
                      {model.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{model.category}</TableCell>
                  <TableCell>{model.price} ICP</TableCell>
                  <TableCell>{model.apiCalls}</TableCell>
                  <TableCell>{model.revenue} ICP</TableCell>
                  <TableCell className="text-right flex gap-2">
                    <Link href={`/vendor/models/${model._id}`} passHref>
                      <Button variant="ghost">Edit</Button>
                    </Link>
                    <Button
                      type="button"
                      className="bg-red-600 text-white flex items-center gap-2"
                      onClick={() => handleDelete(model._id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
}
