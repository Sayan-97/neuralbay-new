import { NextResponse } from "next/server"

// This is a mock database. In a real application, you would use a proper database.
const mockModels = [
  {
    id: "1",
    name: "Stable Diffusion v1",
    description: "State-of-the-art image generation model",
    category: "image",
    price: "0.01",
    apiEndpoint: "https://api.example.com/stable-diffusion",
    status: "Live",
    apiCalls: "5,234",
    revenue: "52.34 ICP",
  },
  {
    id: "2",
    name: "GPT-4 Turbo",
    description: "Advanced language model for text processing",
    category: "text",
    price: "0.05",
    apiEndpoint: "https://api.example.com/gpt4-turbo",
    status: "Draft",
    apiCalls: "1,234",
    revenue: "61.70 ICP",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const model = mockModels.find((m) => m.id === params.id)
    if (model) {
      return NextResponse.json(model)
    } else {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching model:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const index = mockModels.findIndex((m) => m.id === params.id)
  if (index !== -1) {
    mockModels[index] = { ...mockModels[index], ...body }
    return NextResponse.json(mockModels[index])
  } else {
    return NextResponse.json({ error: "Model not found" }, { status: 404 })
  }
}

