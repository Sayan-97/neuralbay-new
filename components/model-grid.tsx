"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory as modelStorageIDL } from "../declarations/model_storage"; // adjust to your project


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

export function ModelGrid({
  filters,
  setShowLoginPrompt,
}: {
  filters: { category: string; price: string; search: string };
  setShowLoginPrompt: (value: boolean) => void;
}) {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const agent = new HttpAgent({ host: "https://icp-api.io" });
      await agent.fetchRootKey();
  
      const modelStorage = Actor.createActor(
        // Import your IDL correctly here:
        require("@/declarations/model_storage").idlFactory,
        {
          agent,
          canisterId: "c7sly-xiaaa-aaaal-qsmca-cai", // your model_storage canister ID
        }
      );
  
      const result = await modelStorage.getModels();
  
      const processedModels: Model[] = result.map((model: any, index: number) => ({
        _id: `model-${index}`,
        name: model.name,
        description: model.description,
        category: model.category,
        price: model.price,
        image: model.image || "https://via.placeholder.com/400x300",
        rating: "4.2k",
        type: "Subscription",
      }));
  
      setModels(processedModels);
    } catch (error) {
      console.error("❌ Error fetching models from canister:", error);
      toast.error("Failed to fetch models.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCardClick = async (modelId: string) => {
    if (!authContext || !authContext.principal) {
      setShowLoginPrompt(true);
      return;
    }

    router.push(`/model/${modelId}`);
  };

  const filteredModels = models.filter((model) => {
    const categoryMatch =
      filters.category === "all" ||
      model.category.toLowerCase().includes(filters.category.toLowerCase());
    const priceMatch =
      filters.price === "all" ||
      (filters.price === "free" && model.price === "Free") ||
      (filters.price === "paid" && model.price !== "Free");
    const searchMatch =
      model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      model.description.toLowerCase().includes(filters.search.toLowerCase());

    return categoryMatch && priceMatch && searchMatch;
  });

  if (loading) {
    return <div className="text-center text-gray-500">Loading models...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {filteredModels.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full">
          No models found.
        </div>
      ) : (
        filteredModels.map((model, index) => (
          <motion.div
            key={model._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="glossy-card overflow-hidden hover-glow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={model.image ?? "https://via.placeholder.com/400x300"}
                    alt={model.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />

                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-white"
                    >
                      {model.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2 text-white">
                  {model.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  {model.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {model.price}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#ffc107] text-[#ffc107]" />
                    {model.rating}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Badge
                  variant="outline"
                  className="border-accent-foreground text-muted-foreground"
                >
                  {model.type}
                </Badge>
                <Button
                  asChild
                  variant="ghost"
                  className="font-semibold text-primary cursor-pointer hover:text-primary-foreground hover:bg-primary"
                  onClick={() => handleCardClick(model._id)}
                >
                  <span className="flex items-center">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
