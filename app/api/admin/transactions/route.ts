import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const type = searchParams.get("type") || ""
    const status = searchParams.get("status") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    let supabaseQuery = supabaseAdmin
      .from("transactions")
      .select(`
        *,
        users:user_id(name),
        models:model_id(name)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters if provided
    if (query) {
      supabaseQuery = supabaseQuery.or(`id.ilike.%${query}%,users.name.ilike.%${query}%,models.name.ilike.%${query}%`)
    }

    if (type) {
      supabaseQuery = supabaseQuery.eq("type", type)
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq("status", status)
    }

    const { data: transactions, error } = await supabaseQuery

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    // Process the data to format it for the frontend
    const processedTransactions = transactions?.map((transaction) => {
      return {
        id: transaction.id,
        type: transaction.type,
        amount: `${transaction.amount.toFixed(2)} ICP`,
        status: transaction.status,
        user: transaction.users?.name || "Unknown",
        model: transaction.models?.name || "N/A",
        date: new Date(transaction.created_at).toLocaleString(),
      }
    })

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from("transactions")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Error counting transactions:", countError)
    }

    return NextResponse.json({
      transactions: processedTransactions,
      pagination: {
        total: totalCount || 0,
        page,
        limit,
        pages: Math.ceil((totalCount || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Unexpected error in transactions list:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

