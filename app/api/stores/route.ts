import { NextResponse } from "next/server"

// In-memory store for stores
const stores: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const store = stores.find((s) => s.id === id)
    return NextResponse.json(store || { error: "Store not found" })
  } else {
    return NextResponse.json(stores)
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const newStore = { id: Date.now().toString(), ...body }
  stores.push(newStore)
  return NextResponse.json(newStore)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const body = await request.json()

  if (id) {
    const index = stores.findIndex((s) => s.id === id)
    if (index !== -1) {
      stores[index] = { ...stores[index], ...body }
      return NextResponse.json(stores[index])
    } else {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }
  } else {
    return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const index = stores.findIndex((s) => s.id === id)
    if (index !== -1) {
      stores.splice(index, 1)
      return NextResponse.json({ message: "Store deleted successfully" })
    } else {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }
  } else {
    return NextResponse.json({ error: "Store ID is required" }, { status: 400 })
  }
}

