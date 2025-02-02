import { NextResponse } from "next/server"

// In-memory store for users
const users: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const user = users.find((u) => u.id === id)
    return NextResponse.json(user || { error: "User not found" })
  } else {
    return NextResponse.json(users)
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const newUser = { id: Date.now().toString(), ...body }
  users.push(newUser)
  return NextResponse.json(newUser)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const body = await request.json()

  if (id) {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...body }
      return NextResponse.json(users[index])
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  } else {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) {
      users.splice(index, 1)
      return NextResponse.json({ message: "User deleted successfully" })
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
  } else {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }
}

