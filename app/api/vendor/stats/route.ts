import { NextResponse } from "next/server"

// Mock data - in a real application, this would come from a database
const vendorStats = {
  totalRevenue: 1234,
  activeUsers: 573,
  apiCalls: 12234,
  revenueChange: 20.1,
  userChange: 201,
  apiCallsChange: 19,
}

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(vendorStats)
}

