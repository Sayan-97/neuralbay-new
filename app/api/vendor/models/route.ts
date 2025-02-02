import { NextResponse } from "next/server"

// This is a mock database. In a real application, you would use a proper database.
const mockModels = [
  {
    id: "1",
    name: "Stable Diffusion v1",
    status: "Live",
    category: "Image Generation",
    price: "0.01 ICP / call",
    apiCalls: "5,234",
    revenue: "52.34 ICP",
  },
  {
    id: "2",
    name: "GPT-4 Turbo",
    status: "Draft",
    category: "Text Processing",
    price: "0.05 ICP / call",
    apiCalls: "1,234",
    revenue: "61.70 ICP",
  },
  {
    id: "3",
    name: "Whisper ASR",
    status: "Live",
    category: "Audio Processing",
    price: "0.02 ICP / call",
    apiCalls: "3,456",
    revenue: "69.12 ICP",
  },
]

export async function GET() {
  // In a real application, you would fetch this data from a database
  return NextResponse.json(mockModels)
}

export async function POST(request: Request) {
  const body = await request.json()
  // In a real application, you would validate the input and save to a database
  const newModel = {
    id: (mockModels.length + 1).toString(),
    ...body,
    status: "Draft",
    apiCalls: "0",
    revenue: "0 ICP",
  }
  mockModels.push(newModel)
  return NextResponse.json(newModel, { status: 201 })
}

