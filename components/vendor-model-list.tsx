"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

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
    } finally {
      setLoading(false);
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
    key={model._id}  // ✅ Use _id instead of id
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
    <TableCell className="text-right">
      <Button variant="ghost">
        <Link href={`/vendor/models/${model._id}`}>Edit</Link>  
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
