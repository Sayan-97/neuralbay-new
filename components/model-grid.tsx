"use client";

import Link from "next/link";
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
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const models = [
  {
    id: "1",
    name: "Stable Diffusion v1",
    description: "State-of-the-art image generation model",
    category: "Image Generation",
    price: "0.01 ICP / call",
    image: "https://picsum.photos/seed/model1/400/300",
    rating: "4.5k",
    type: "Subscription",
  },
  {
    id: "2",
    name: "GPT-4 Turbo",
    description: "Advanced language model for text processing",
    category: "Text Processing",
    price: "0.05 ICP / call",
    image: "https://picsum.photos/seed/model2/400/300",
    rating: "4.5k",
    type: "Purchase",
  },
  {
    id: "3",
    name: "Whisper ASR",
    description: "Accurate speech recognition model",
    category: "Audio Processing",
    price: "0.02 ICP / call",
    image: "https://picsum.photos/seed/model3/400/300",
    rating: "4.5k",
    type: "Subscription",
  },
  {
    id: "4",
    name: "Leonardo AI",
    description:
      "AI model specializing in styling images to various art styles as prompted by the user",
    category: "Image Generation",
    image: "https://picsum.photos/seed/model4/400/300",
    rating: "4.5k",
    price: "Free",
    type: "Free",
  },
  {
    id: "5",
    name: "DALL-E 3",
    description:
      "Advanced image generation model with improved coherence and detail",
    category: "Image Generation",
    price: "0.03 ICP / call",
    image: "https://picsum.photos/seed/model5/400/300",
    rating: "4.8k",
    type: "Subscription",
  },
  {
    id: "6",
    name: "BertSum",
    description: "Extractive text summarization model based on BERT",
    category: "Text Processing",
    price: "0.01 ICP / call",
    image: "https://picsum.photos/seed/model6/400/300",
    rating: "4.2k",
    type: "Subscription",
  },
];

export function ModelGrid({
  filters,
  setShowLoginPrompt,
}: {
  filters: { category: string; price: string; search: string };
  setShowLoginPrompt: (value: boolean) => void;
}) {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const handleCardClick = async (modelId: string) => {
    if (!authContext || !authContext.principal) {
      setShowLoginPrompt(true);
      return;
    }

    router.push(`/model/${modelId}`);

    // const hasPurchased = await checkPurchaseStatus(authContext.principal, modelId);
    // if (hasPurchased) {
    //     const model = models.find((m) => m.modelId === modelId);
    //     window.location.href = "https://model-test-chi.vercel.app/";
    // } else {
    //     navigate(`/marketplace/${modelId}`);
    // }
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {filteredModels.map((model, index) => (
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className="glossy-card overflow-hidden hover-glow">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={model.image || "/placeholder.svg"}
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
                onClick={() => handleCardClick(model.id)}
              >
                <span className="flex items-center">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
