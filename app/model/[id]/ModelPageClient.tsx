"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelApiTest } from "@/components/model-api-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { usePlug } from "@/hooks/usePlug";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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

export default function ModelPageClient({
  initialData,
  params,
}: ModelPageClientProps) {
  const [model] = useState<ModelData>(initialData);
  const { isConnected, connectPlug, requestTransfer } = usePlug();
  const authContext = useContext(AuthContext);
  const [purchased, setPurchased] = useState<boolean>(false);
  const router = useRouter();

  const isOwner =
  (authContext?.principal || "").trim() === (model?.userId || "").trim();


  if (!authContext || !authContext.principal) {
    router.push("/marketplace");
    return;
  }

  useEffect(() => {
    const checkIfPurchased = async () => {
      if (!authContext?.principal || !model._id) return;

      try {
        const response = await fetch(
          `http://localhost:3001/api/users/purchases/${model._id}`,
          {
            headers: { "x-user-id": authContext.principal },
          }
        );

        if (!response.ok) {
          console.error(
            `❌ Failed to fetch purchase status: ${response.status}`
          );
          return;
        }

        const data = await response.json();
        console.log("🔄 Purchase Status Fetched:", data);

        setPurchased(data.purchased); // ✅ Ensure button updates correctly
      } catch (error) {
        console.error("❌ Error checking purchase status:", error);
      }
    };

    checkIfPurchased();
  }, [model._id, authContext?.principal, purchased]); // ✅ Ensure it re-runs after a purchase

  const handleBuyClick = async () => {
    if (!authContext || !authContext.principal) {
      console.error("❌ User is not authenticated or principal ID is missing.");
      router.push("/login");
      return;
    }

    if (!model || !model._id) {
      console.error("❌ Model ID is missing!", model);
      alert("Error: Model ID is missing.");
      return;
    }

    if (!model.wallet_principal_id) {
      console.error("❌ Recipient wallet address is missing.");
      alert("Error: No recipient wallet address found for this model.");
      return;
    }

    console.log("🔄 Checking Plug connection...");
    let connected = isConnected;
    
    if (!connected) {
      connected = await connectPlug();
      if (!connected) {
        console.error("❌ Plug Wallet connection failed.");
        alert("Plug Wallet connection failed. Please try again.");
        return;
      }
    }
    

    try {
      const recipientWallet = model.wallet_principal_id;
      const amountICP = Number.parseFloat(model.price || "0");

      console.log(`🔄 Transferring ${amountICP} ICP to ${recipientWallet}`);

      const response = await requestTransfer(recipientWallet, amountICP);

      if (!response?.height) {
        console.warn("⚠️ Transaction canceled or failed.");
        alert("Transaction was canceled or failed. Please try again.");
        return;
      }

      console.log("✅ Transaction successful:", response);

      // ✅ Save purchase in the database
      const modelResponse = await fetch(
        `http://localhost:3001/api/marketplace/models/${model._id}/purchase`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": authContext.principal,
          },
        }
      );

      if (!modelResponse.ok) {
        console.error(`❌ Error recording purchase: ${modelResponse.status}`);
        alert(`Error: ${modelResponse.statusText}`);
        return;
      }

      console.log("✅ Purchase recorded in database");
      alert("✅ Purchase successful!");

      // ✅ Immediately update UI
      setPurchased(true); // Ensures button changes to "Purchased"
    } catch (error) {
      console.error("❌ Transaction error:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  console.log("authContext.principal", `"${authContext.principal}"`);
console.log("model.wallet_principal_id", `"${model.wallet_principal_id}"`);
console.log("model.user_id", `"${model.userId}"`);


  return (
    <div className="container py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="glossy-card p-6 rounded-lg mb-6">
            <div className="relative h-64 w-full mb-6">
              {model ? (
                <Image
                  src={model.image || "/placeholder.svg"}
                  alt={model.name}
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <p className="text-center">Loading model...</p>
              )}
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
  
  {model.category === "image" && (
    <>
      <p className="mb-4">
        This image generation model creates high-quality visuals from text prompts using diffusion techniques.
      </p>
      <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
      <ul className="list-disc list-inside mb-4">
        <li>High-resolution image generation (up to 1024x1024)</li>
        <li>Diverse style and content generation</li>
        <li>Fine control over image attributes</li>
        <li>Fast inference times</li>
      </ul>
      <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
      <ul className="list-disc list-inside">
        <li>Digital art creation</li>
        <li>Game and film concept art</li>
        <li>Product design visualization</li>
        <li>AR content generation</li>
      </ul>
    </>
  )}

  {model.category === "text" && (
    <>
      <p className="mb-4">
        This text generation model produces human-like language outputs based on your prompts using advanced transformer architecture.
      </p>
      <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Context-aware text generation</li>
        <li>Support for summarization, translation, and Q&A</li>
        <li>High coherence and relevance</li>
        <li>Multi-language support</li>
      </ul>
      <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
      <ul className="list-disc list-inside">
        <li>Chatbots and virtual assistants</li>
        <li>Content creation</li>
        <li>Code generation</li>
        <li>Language translation</li>
      </ul>
    </>
  )}

  {model.category === "audio" && (
    <>
      <p className="mb-4">
        This audio model performs tasks like speech synthesis, enhancement, and transcription with high accuracy.
      </p>
      <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
      <ul className="list-disc list-inside mb-4">
        <li>Text-to-speech synthesis</li>
        <li>Speech recognition and transcription</li>
        <li>Noise reduction and enhancement</li>
        <li>Emotion-aware speech generation</li>
      </ul>
      <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
      <ul className="list-disc list-inside">
        <li>Voice assistants</li>
        <li>Audio content generation</li>
        <li>Podcast automation</li>
        <li>Accessibility applications</li>
      </ul>
    </>
  )}
</TabsContent>

            <TabsContent value="api" className="p-6">
              <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
              <p className="mb-4">API Endpoint: {model.apiEndpoint}</p>
              <ModelApiTest />
            </TabsContent>
            <TabsContent value="pricing" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pricing</h2>
              <p className="mb-4">Price per call: {model.price}</p>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Subscription Plans
                </h3>
                <ul className="space-y-2">
                  <li>Basic: 1,000 calls/month - 8 ICP</li>
                  <li>Pro: 10,000 calls/month - 70 ICP</li>
                  <li>Enterprise: Custom pricing for high-volume usage</li>
                </ul>
              </div>
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
                {!isOwner ? (
  <Button
    className="w-full"
    onClick={handleBuyClick}
    disabled={purchased}
  >
    {purchased ? "Purchased" : "Buy Now"}
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
