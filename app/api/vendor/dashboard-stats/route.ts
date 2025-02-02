import { NextResponse } from "next/server"

export async function GET() {
  // This is mock data. In a real application, you would fetch this from your database.
  const stats = {
    totalRevenue: 1234,
    activeUsers: 573,
    apiCalls: 12234,
    revenueChange: 20.1,
    userChange: 201,
    apiCallsChange: 19,
  }

  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(stats)
}

