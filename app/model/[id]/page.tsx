"use client";

import { useState, useEffect } from "react";
import ModelPageClient from "./ModelPageClient";
import { toast } from "sonner";

// ✅ Define the expected model structure
interface Model {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image?: string;
  rating: string; 
  type: string;
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const [modelData, setModelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/marketplace/models/${params.id}`);
    
        if (!response.ok) {
          throw new Error("Model not found");
        }
    
        const modelData = await response.json();
        setModelData(modelData);
      } catch (error) {
        console.error("Error fetching model:", error);
        toast.error("Failed to fetch model.");
        setError("Model not found");
      } finally {
        setLoading(false);
      }
    };
    
    fetchModelData();
  }, [params.id]);

  if (loading) {
    return <div className="text-center text-lg">Loading model data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  return <ModelPageClient initialData={modelData} params={{ id: modelData?._id }} />;

}
