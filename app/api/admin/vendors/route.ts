import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const status = searchParams.get("status") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Get vendors (users with role 'vendor')
    let supabaseQuery = supabaseAdmin
      .from("users")
      .select(`
        *,
        models:models(id),
        revenue:transactions(amount)
      `)
      .eq("role", "vendor")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq("status", status)
    }

    const { data: vendors, error } = await supabaseQuery

    if (error) {
      console.error("Error fetching vendors:", error)
      return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 })
    }

    // Process the data to get the count of models and total revenue
    const processedVendors = vendors?.map((vendor) => {
      const modelCount = vendor.models ? vendor.models.length : 0
      const totalRevenue = vendor.revenue
        ? vendor.revenue.reduce((sum: number, transaction: any) => sum + (transaction.amount || 0), 0)
        : 0

      return {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        status: vendor.status,
        models: modelCount,
        revenue: `${totalRevenue.toFixed(2)} ICP`,
        joinedAt: vendor.created_at,
      }
    })

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "vendor")

    if (countError) {
      console.error("Error counting vendors:", countError)
    }

    return NextResponse.json({
      vendors: processedVendors,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error in vendors list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

