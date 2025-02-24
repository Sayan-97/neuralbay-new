import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelApiTest } from "@/components/model-api-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Share2 } from "lucide-react";
import Image from "next/image";

export async function generateStaticParams() {
  // For now, return a static set of IDs to avoid build errors
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function ModelPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the model data based on the ID
  const model = {
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
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{model.category}</Badge>
              <span className="text-sm text-muted-foreground">
                by {model.vendor}
              </span>
              <div className="flex items-center ml-auto">
                <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                <span className="font-medium">{model.rating}</span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({model.ratingCount})
                </span>
              </div>
            </div>
            <p className="text-lg mb-6">{model.description}</p>
          </div>
          <Tabs defaultValue="details" className="glossy-card rounded-lg">
            <TabsList className="w-full justify-start rounded-t-lg border-b">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Model Details</h2>
              <p className="mb-4">
                Stable Diffusion v1 is a state-of-the-art image generation model
                that can create high-quality images from textual descriptions.
                It uses a diffusion-based approach to generate images, resulting
                in more coherent and detailed outputs compared to previous
                models.
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
                <li>Concept art for games and movies</li>
                <li>Product design visualization</li>
                <li>Augmented reality content generation</li>
              </ul>
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
              <p className="text-2xl font-bold mb-4">{model.price}</p>
              <Button className="w-full mb-4">Subscribe</Button>
              <div className="flex justify-between mb-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
