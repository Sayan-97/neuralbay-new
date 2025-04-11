"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import toast from "react-hot-toast";
import Image from "next/image";

import { useIdentityKit } from "@/hooks/useIdentityKit";
import { AuthContext } from "@/context/AuthContext";
import { idlFactory as purchaseIDL } from "@/declarations/purchase";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelApiTest } from "@/components/model-api-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Share2 } from "lucide-react";

interface ModelPrice {
  icp: number;
  eth: string;
  dollar: number;
}

interface ModelData {
  _id: any;
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  vendor: string;
  apiEndpoint: string;
  image: string;
  rating: string;
  ratingCount: string;
  modelPrice: ModelPrice;
  wallet_principal_id?: string;
  userId?: string;
}

interface ModelPageClientProps {
  initialData: ModelData;
  params: { id: string };
}

const PURCHASE_CANISTER_ID = "cytnm-2qaaa-aaaal-qsmcq-cai";

export default function ModelPageClient({
  initialData,
  params,
}: ModelPageClientProps) {
  const [model] = useState<ModelData>(initialData);
  const { requestTransfer } = useIdentityKit();
  const authContext = useContext(AuthContext);
  const [purchased, setPurchased] = useState<boolean>(false);
  const [checkPurchaseTrigger, setCheckPurchaseTrigger] = useState(0);
  const router = useRouter();

  const isOwner =
    (authContext?.principal || "").trim() === (model?.userId || "").trim();

  useEffect(() => {
    if (!authContext?.principal) {
      router.push("/marketplace");
    }
  }, [authContext?.principal]);

  const checkIfPurchased = async () => {
    if (!authContext?.principal || !model._id) return;

    try {
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();

      const purchaseActor = Actor.createActor(purchaseIDL, {
        agent,
        canisterId: PURCHASE_CANISTER_ID,
      });

      const result = await purchaseActor.hasUserPurchasedModel(
        Principal.fromText(authContext.principal),
        model._id
      );

      setPurchased(result as boolean);
    } catch (err) {
      console.error("🔴 Failed to check purchase status:", err);
      toast.error("Couldn't verify purchase.");
    }
  };

  // 🔁 Check purchase status on mount and after successful buy
  useEffect(() => {
    checkIfPurchased();
  }, [checkPurchaseTrigger]);

  useEffect(() => {
    checkIfPurchased();
  }, []);

  const handleBuyClick = async () => {
    if (!authContext || !authContext.principal) {
      router.push("/login");
      return;
    }
  
    if (!model || !model._id || !model.wallet_principal_id) {
      toast.error("Missing model or wallet info.");
      return;
    }
  
    try {
      const recipientWallet = model.wallet_principal_id;
      const amountICP = parseFloat(model.price || "0");
  
      toast.loading("🔁 Initiating payment...");
  
      const transferResult = await requestTransfer(recipientWallet, amountICP);
      if (!transferResult) {
        toast.dismiss();
        toast.error("❌ ICP Transfer failed.");
        return;
      }
  
      toast.success("💸 ICP sent successfully.");
  
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();
  
      const purchaseActor = Actor.createActor(purchaseIDL, {
        agent,
        canisterId: PURCHASE_CANISTER_ID,
      });
  
      const result = await purchaseActor.recordPurchase(
        Principal.fromText(authContext.principal),
        model._id
      );
  
      toast.dismiss();
      toast.success("✅ Purchase confirmed and recorded on-chain!");
  
      setCheckPurchaseTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Purchase error:", err);
      toast.dismiss();
      toast.error("Purchase process failed.");
    }
  };
  

  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glossy-card p-6 rounded-lg mb-6">
            <div className="relative h-64 w-full mb-6">
              <Image
                src={model.image || "/placeholder.svg"}
                alt={model.name}
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{model.name}</h1>
              <div className="flex items-center gap-2">
                <Badge>{model.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  by {model.vendor}
                </span>
                <div className="flex items-center ml-auto">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({model.ratingCount})
                  </span>
                </div>
              </div>
              <p className="text-lg">{model.description}</p>
            </div>
          </div>

          <Tabs defaultValue="details" className="glossy-card rounded-lg">
            <TabsList className="w-full justify-start rounded-t-lg border-b">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Model Details</h2>
              <p>This section will include feature list and use cases based on category.</p>
            </TabsContent>
            <TabsContent value="api" className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
              <p className="mb-4">API Endpoint: {model.apiEndpoint}</p>
              <ModelApiTest />
            </TabsContent>
            <TabsContent value="pricing" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <p className="mb-4">Price per call: {model.price} ICP</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="glossy-card sticky top-6">
            <CardHeader>
              <CardTitle>Purchase Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold">{model.price} ICP</p>
                </div>

                {!isOwner && purchased ? (
                  <Button className="w-full" disabled>
                    Purchased
                  </Button>
                ) : !isOwner ? (
                  <Button className="w-full" onClick={handleBuyClick}>
                    Buy Now
                  </Button>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">
                    Owner
                  </p>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" className="w-[48%]">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button variant="outline" className="w-[48%]">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  By purchasing, you agree to our{" "}
                  <a href="#" className="underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
