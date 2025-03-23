import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let supabaseQuery = supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    }

    if (role) {
      supabaseQuery = supabaseQuery.eq("role", role)
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq("status", status)
    }

    const { data: users, error, count } = await supabaseQuery

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting users:", countError)
    }

    return NextResponse.json({
      users,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error in users list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

