"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuthContext } from "@/context/AuthContext";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as modelStorageIDL } from "@/declarations/model_storage";
import { idlFactory as brokerIDL } from "@/declarations/broker";
import { Principal } from "@dfinity/principal";
import { useIdentityKit } from "@/hooks/useIdentityKit";

// Returned model from canister
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

// Display model in UI
interface Model {
  _id: string;
  index: number;              // ✅ Needed for backend
  size_bytes: number;         // ✅ Needed for cycles calc
  name: string;
  description: string;
  apiEndpoint: string;
  image: string;
  category: string;
  price: string;
  status: string;
  apiCalls: number;
  revenue: number;
}



export function VendorModelList() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const { principal } = useContext(AuthContext) || {};
    
  const { requestTransfer, principalId } = useIdentityKit();

  useEffect(() => {
    if (principal) fetchModelsFromCanister(principal);
  }, [principal]);

  const fetchModelsFromCanister = async (uploaderPrincipal: string) => {
    try {
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();

      const modelStorage = Actor.createActor(modelStorageIDL, {
        agent,
        canisterId: "c7sly-xiaaa-aaaal-qsmca-cai",
      });

      const rawModels = await modelStorage.getModelsByUploader(
        Principal.fromText(uploaderPrincipal)
      );

      const processed = rawModels.map((m: CanisterModel, index: number) => ({
        _id: `model-${index}`,     // index based on array position
        index,
        size_bytes: m.size_bytes,
        name: m.name,
        description: m.description,
        category: m.category,
        price: m.price,
        apiEndpoint: m.apiEndpoint,
        image: m.image,
        status: "Live",
        apiCalls: Math.floor(Math.random() * 100),
        revenue: parseFloat((Math.random() * 2).toFixed(2)),
      }));
      
      

      setModels(processed);
    } catch (error) {
      console.error("❌ Failed to fetch models:", error);
      toast.error("Error loading models.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (index: number, size_bytes: number, modelId: string) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;
  
    try {
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();
  
      const broker = Actor.createActor(brokerIDL, {
        agent,
        canisterId: "ckv2v-waaaa-aaaal-qsmbq-cai",
      });
  
  
      const cyclesPerByte = 200_000;
      const requiredCycles = size_bytes * cyclesPerByte;
      const icpE8s = Math.ceil(requiredCycles / 10_000);
      const icpAmount = icpE8s / 100_000_000;
  
      console.log("🧮 Deleting model of size:", size_bytes, "bytes");
      console.log("💰 Required cycles:", requiredCycles);
      console.log("💰 Required ICP (e8s):", icpE8s);
      console.log("💸 As decimal ICP:", icpAmount);
  
      const pendingPayments = await broker.getAllConfirmedPayments() as Array<[string, bigint]>;
      const hasPending = pendingPayments.find(([payer]) => payer.toString() === principalId);
  
      if (!hasPending) {
        toast.loading("💸 Sending ICP for deletion...");
        const transferResult = await requestTransfer("ckv2v-waaaa-aaaal-qsmbq-cai", icpAmount);
        toast.dismiss();
  
        if (typeof transferResult !== "bigint") {
          toast.error("❌ Payment failed. Aborting delete.");
          return;
        }
  
        await broker.confirmPayment(BigInt(icpE8s));
        toast.success("✅ Payment sent and confirmed.");
      } else {
        toast("💡 Reusing previous payment...");
        await broker.confirmPayment(BigInt(icpE8s));
      }
  
      const result = await broker.deleteModel(index, size_bytes);
      console.log("🧹 Delete result:", result);
  
      toast.success("Model deleted!");
      setModels((prev) => prev.filter((m) => m._id !== modelId));
    } catch (err) {
      console.error("❌ Failed to delete model:", err);
      toast.error("Delete failed.");
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
        <div className="text-center text-gray-500">
          No models found. Try adding one!
        </div>
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
  onClick={() => handleDelete(index, 2000, model._id)}
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
