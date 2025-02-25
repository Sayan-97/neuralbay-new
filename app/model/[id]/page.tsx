import { supabase } from "@/app/utils/supabaseClient";
import ModelPageClient from "./ModelPageClient";

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

async function getModelData(id: string) {
  const { data, error } = await supabase
    .from("models")
    .select("id, name, description, price, modelimg, wallet_principal_id")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching model:", error);
    return null;
  }

  return {
    id: data.id,
    modelId: data.id,
    name: data.name,
    modelName: data.name,
    description: data.description,
    shortDes: data.description,
    modelImg: data.modelimg || "/placeholder.svg",
    image: data.modelimg || "/placeholder.svg",
    modelPrice: {
      eth: data.price?.toString() || "0",
      dollar: (Number.parseFloat(data.price) || 0) * 167,
    },
    wallet_principal_id: data.wallet_principal_id,
    rating: "4.5",
    ratingCount: "1,234",
    reviews: [],
    category: "AI Model",
    vendor: "AI Provider",
  };
}

export default async function ModelPage({
  params,
}: {
  params: { id: string };
}) {
  // const modelData = await getModelData(params.id);
  const modelData = {
    id: params.id,
    name: "Stable Diffusion v1",
    description: "State-of-the-art image generation model",
    category: "Image Generation",
    price: "0.01 ICP / call",
    vendor: "AI Research Labs",
    apiEndpoint: "https://api.example.com/v1/generate",
    image: "https://picsum.photos/seed/model1/800/400",
    rating: "4.5",
    ratingCount: "1,234",
    modelPrice: {
      eth: "0.01",
      dollar: 1.67,
    },
    wallet_principal_id: "example-principal-id", // Add a placeholder principal ID
  }

  return <ModelPageClient initialData={modelData} params={params} />;
}
