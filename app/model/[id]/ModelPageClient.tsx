"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModelApiTest } from "@/components/model-api-test"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Download, Share2 } from "lucide-react"
import Image from "next/image"
import { useContext, useState } from "react"
import { usePlug } from "@/hooks/usePlug"
import { AuthContext } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { recordPurchaseInSupabase } from "@/lib/supabaseHelpers"

interface ModelPrice {
  eth: string
  dollar: number
}

interface ModelData {
  id: string
  name: string
  description: string
  category: string
  price: string
  vendor: string
  apiEndpoint: string
  image: string
  rating: string
  ratingCount: string
  modelPrice: ModelPrice
  wallet_principal_id?: string
}

interface ModelPageClientProps {
  initialData: ModelData
  params: { id: string }
}

export default function ModelPageClient({ initialData, params }: ModelPageClientProps) {
  const [model] = useState<ModelData>(initialData)
  const { isConnected, connectPlug, requestTransfer } = usePlug()
  const authContext = useContext(AuthContext)
  const router = useRouter()

  if (!authContext || !authContext.principal) {
    router.push("/marketplace");
    return;
  }

  const handleBuyClick = async () => {
    if (!authContext || !authContext.principal) {
      console.error("User is not authenticated or principal ID is missing.")
      router.push("/login")
      return
    }

    if (!model.wallet_principal_id) {
      console.error("Recipient wallet address is missing.")
      alert("Error: No recipient wallet address found for this model.")
      return
    }

    try {
      const amountICP = Number.parseFloat(model.modelPrice?.eth || "0")
      console.log(`Transferring ${amountICP} ICP to ${model.wallet_principal_id}`)

      const response = await requestTransfer(model.wallet_principal_id, amountICP)

      if (response && response.height) {
        console.log("Transaction successful:", response)
        await recordPurchaseInSupabase(authContext.principal, model.id)
        alert("Purchase successful!")
        router.push("/")
      } else {
        console.warn("Transaction canceled or failed.")
        alert("Transaction was canceled or failed. Please try again.")
      }
    } catch (error) {
      console.error("Transaction error:", error)
      alert("Transaction failed. Please try again.")
    }
  }

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
                <span className="text-sm text-muted-foreground">by {model.vendor}</span>
                <div className="flex items-center ml-auto">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">({model.ratingCount})</span>
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
              <p className="mb-4">
                Stable Diffusion v1 is a state-of-the-art image generation model that can create high-quality images
                from textual descriptions. It uses a diffusion-based approach to generate images, resulting in more
                coherent and detailed outputs compared to previous models.
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
                <h3 className="text-lg font-semibold mb-2">Subscription Plans</h3>
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
                  <p className="text-3xl font-bold">{model.modelPrice.eth} ICP</p>
                  <p className="text-lg text-muted-foreground">${model.modelPrice.dollar}</p>
                </div>
                <Button className="w-full" onClick={handleBuyClick}>
                  Buy Now
                </Button>
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
  )
}

