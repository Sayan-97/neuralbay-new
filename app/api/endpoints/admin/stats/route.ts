import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })

    // Get total vendors count
    const { count: totalVendors, error: vendorsError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "vendor")

    // Get total models count
    const { count: totalModels, error: modelsError } = await supabaseAdmin
      .from("models")
      .select("*", { count: "exact", head: true })

    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabaseAdmin
      .from("transactions")
      .select("amount")
      .eq("status", "completed")

    const totalRevenue = revenueData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0

    // Get active users (users who logged in within the last 24 hours)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    const { count: activeUsers, error: activeUsersError } = await supabaseAdmin
      .from("user_sessions")
      .select("*", { count: "exact", head: true })
      .gt("last_seen", oneDayAgo.toISOString())

    // Get pending model approvals
    const { count: pendingApprovals, error: pendingApprovalsError } = await supabaseAdmin
      .from("models")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Calculate growth rate (comparing users this month vs last month)
    const thisMonth = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const { count: thisMonthUsers, error: thisMonthError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.toISOString())
      .lt("created_at", thisMonth.toISOString())

    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    const { count: lastMonthUsers, error: lastMonthError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoMonthsAgo.toISOString())
      .lt("created_at", lastMonth.toISOString())

    const growthRate = lastMonthUsers ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0

    if (
      usersError ||
      vendorsError ||
      modelsError ||
      revenueError ||
      activeUsersError ||
      pendingApprovalsError ||
      thisMonthError ||
      lastMonthError
    ) {
      console.error("Error fetching admin stats:", {
        usersError,
        vendorsError,
        modelsError,
        revenueError,
        activeUsersError,
        pendingApprovalsError,
        thisMonthError,
        lastMonthError,
      })
      return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
    }

    return NextResponse.json({
      totalUsers,
      totalVendors,
      totalModels,
      totalRevenue,
      activeUsers,
      pendingApprovals,
      growthRate: Number.parseFloat(growthRate.toFixed(2)),
    })
  } catch (error) {
    console.error("Unexpected error in admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

