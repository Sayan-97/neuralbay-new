import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || ""
    const startDate = searchParams.get("startDate") || ""
    const endDate = searchParams.get("endDate") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    let supabaseQuery = supabaseAdmin
      .from("admin_logs")
      .select(`
        *,
        admin:performed_by(name)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (action) {
      supabaseQuery = supabaseQuery.eq("action", action)
    }

    if (startDate) {
      supabaseQuery = supabaseQuery.gte("created_at", startDate)
    }

    if (endDate) {
      supabaseQuery = supabaseQuery.lte("created_at", endDate)
    }

    const { data: logs, error } = await supabaseQuery

    if (error) {
      console.error("Error fetching admin logs:", error)
      return NextResponse.json({ error: "Failed to fetch admin logs" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from("admin_logs")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting logs:", countError)
    }

    return NextResponse.json({
      logs,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error in admin logs:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

