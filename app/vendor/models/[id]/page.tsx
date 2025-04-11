
"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as modelStorageIDL } from "@/declarations/model_storage";
import { Principal } from "@dfinity/principal";
import { useIdentityKit } from "@/hooks/useIdentityKit";
import { idlFactory as brokerIDL } from "../../../../declarations/broker";


type CanisterModel = {
  name: string;
  description: string;
  category: string;
  price: string;
  apiEndpoint: string;
  image: string;
  wallet_principal_id: { toText: () => string };
  uploader: { toText: () => string };
  size_bytes: number;
  created_at: bigint;
};

export default function EditModelPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { principal } = useContext(AuthContext) || {};

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { requestTransfer, principalId } = useIdentityKit();


  const [modelData, setModelData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiEndpoint: "",
    modelImg: "",
  });

  useEffect(() => {
    if (principal) fetchModelData();
  }, [params.id, principal]);

  useEffect(() => {
    console.log("📦 Confirmed updated modelData:", modelData);
  }, [modelData]);

  const fetchModelData = async () => {
    if (!params.id || !principal) {
      setError("Missing model ID or not logged in.");
      return;
    }
  
    try {
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();
  
      const modelStorage = Actor.createActor(modelStorageIDL, {
        agent,
        canisterId: "c7sly-xiaaa-aaaal-qsmca-cai",
      });
  
      const index = parseInt(params.id.replace("model-", ""));
      const raw = await modelStorage.getModel(index);
      console.log("📥 Raw result from canister:", raw);
  
      if (!raw || raw.length === 0) {
        throw new Error("Model not found");
      }
  
      const optModel = raw[0]; // 💥 THIS is the actual model
  
      const allowedCategories = ["text", "image", "audio"];
      const cat = allowedCategories.includes(optModel.category)
        ? optModel.category
        : "";
  
      setModelData({
        name: optModel.name ?? "",
        description: optModel.description ?? "",
        category: cat,
        price: optModel.price ?? "",
        apiEndpoint: optModel.apiEndpoint ?? "",
        modelImg: optModel.image ?? "",
      });
  
      console.log("✅ Fetched model from canister:", optModel);
    } catch (err) {
      console.error("❌ Failed to fetch model from canister:", err);
      toast.error("Failed to load model.");
      setError("Failed to load model");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModelData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setModelData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!principalId) {
        toast.error("Principal not found.");
        return;
      }
  
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();
  
      const broker = Actor.createActor(brokerIDL, {
        agent,
        canisterId: "ckv2v-waaaa-aaaal-qsmbq-cai",
      });
  
      const index = parseInt(params.id.replace("model-", ""));
      const payloadSize = new Blob([JSON.stringify(modelData)]).size;
      const requiredCycles = BigInt(payloadSize) * BigInt(200_000);
      const icpE8s = BigInt(Math.ceil(Number(requiredCycles) / 10_000));
      const icpAmount = Number(icpE8s) / 100_000_000;
  
      const hasPayment = await broker.hasPayment(Principal.fromText(principalId));
  
      if (!hasPayment) {
        toast("💸 Sending ICP for update...");
        const transferResult = await requestTransfer("ckv2v-waaaa-aaaal-qsmbq-cai", icpAmount);
  
        if (typeof transferResult !== "bigint") {
          toast.error("Transfer failed. Aborting update.");
          return;
        }
  
        await broker.confirmPayment(icpE8s);
        toast.success("✅ Payment sent and confirmed.");
      } else {
        toast("💡 Using existing payment...");
        await broker.confirmPayment(icpE8s);
      }
  
      const result = await broker.updateModel(
        index,
        BigInt(payloadSize),
        modelData.name,
        modelData.description,
        modelData.category,
        modelData.price,
        modelData.apiEndpoint,
        modelData.modelImg
      );
  
      toast.success(result);
      router.push("/vendor/dashboard");
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error("Update failed.");
    } finally {
      setIsLoading(false);
    }
  };
  


  if (isLoading)
    return <div className="text-center py-20 text-white">Loading model...</div>;

  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1 className="text-3xl font-bold mb-6">
        Edit Model: {modelData.name}
      </motion.h1>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl mx-auto glossy-card p-6"
      >
        <Input
          name="name"
          value={modelData.name}
          onChange={handleInputChange}
          placeholder="Model Name"
        />
        <Textarea
          name="description"
          value={modelData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <Select
          value={modelData.category}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="price"
          value={modelData.price}
          onChange={handleInputChange}
          placeholder="Price in ICP"
        />
        <Input
          name="apiEndpoint"
          value={modelData.apiEndpoint}
          onChange={handleInputChange}
          placeholder="API Endpoint"
        />

        {modelData.modelImg && (
          <img
            src={modelData.modelImg}
            alt="Model preview"
            className="w-48 h-auto mt-4 rounded-md border"
          />
        )}

        <Button type="submit" className="w-full">
          {isLoading ? "Updating..." : "Update Model"}
        </Button>
      </motion.form>
    </motion.div>
  );
}
