"use client";

import { useState, useEffect } from "react";
import ModelPageClient from "./ModelPageClient";
import { toast } from "sonner";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as modelStorageIDL } from "@/declarations/model_storage";

// Match your Motoko model structure
interface Model {
  name: string;
  description: string;
  category: string;
  price: string;
  apiEndpoint: string;
  image: string;
  wallet_principal_id: string;
  uploader: string;
  size_bytes: number;
  created_at: bigint;
}

export default function ModelPage({ params }: { params: { id: string } }) {
  const [modelData, setModelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModelFromCanister = async () => {
      try {
        const agent = new HttpAgent({ host: "https://icp-api.io" });
        await agent.fetchRootKey();

        const modelStorage = Actor.createActor(modelStorageIDL, {
          agent,
          canisterId: "c7sly-xiaaa-aaaal-qsmca-cai",
        });

        const index = parseInt(params.id.replace("model-", ""));
        const result = await modelStorage.getModel(index);

        if (!result || result.length === 0) {
          throw new Error("Model not found.");
        }

        const model = result[0];

        setModelData({
          _id: `model-${index}`,
          id: `model-${index}`,
          name: model.name,
          description: model.description,
          category: model.category,
          price: model.price,
          apiEndpoint: model.apiEndpoint,
          image: model.image,
          wallet_principal_id: model.wallet_principal_id.toText(),
          userId: model.uploader.toText(),
          rating: "4.2", // or derive from other data
          ratingCount: "1k", // placeholder
          vendor: model.uploader.toText(), // or a lookup
          modelPrice: {
            icp: parseFloat(model.price),
            eth: "0.00",
            dollar: 0,
          },
        });
      } catch (error) {
        console.error("❌ Error fetching model:", error);
        toast.error("Failed to fetch model from canister.");
        setError("Model not found");
      } finally {
        setLoading(false);
      }
    };

    fetchModelFromCanister();
  }, [params.id]);

  if (loading) {
    return <div className="text-center text-lg">Loading model data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return <ModelPageClient initialData={modelData} params={{ id: modelData?._id }} />;
}
