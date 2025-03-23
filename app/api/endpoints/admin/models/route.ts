import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const status = searchParams.get("status") || ""
    const category = searchParams.get("category") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let supabaseQuery = supabaseAdmin
      .from("models")
      .select(`
        *,
        vendors:vendor_id(name),
        categories:category_id(name)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (query) {
      supabaseQuery = supabaseQuery.ilike("name", `%${query}%`)
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq("status", status)
    }

    if (category) {
      supabaseQuery = supabaseQuery.eq("category_id", category)
    }

    const { data: models, error, count } = await supabaseQuery

    if (error) {
      console.error("Error fetching models:", error)
      return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from("models")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting models:", countError)
    }

    return NextResponse.json({
      models,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error in models list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

