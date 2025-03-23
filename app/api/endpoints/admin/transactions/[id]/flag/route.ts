import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const flagReason = body.reason || "Suspicious activity"

    // Update transaction to flagged status
    const { data: transaction, error } = await supabaseAdmin
      .from("transactions")
      .update({
        is_flagged: true,
        flag_reason: flagReason,
        flagged_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error flagging transaction:", error)
      return NextResponse.json({ error: "Failed to flag transaction" }, { status: 500 })
    }

    // Create an admin notification/alert
    const { error: alertError } = await supabaseAdmin.from("admin_alerts").insert({
      type: "flagged_transaction",
      title: "Transaction Flagged",
      message: `Transaction ${params.id} has been flagged for review. Reason: ${flagReason}`,
      data: {
        transaction_id: params.id,
        reason: flagReason,
        user_id: transaction.user_id,
        amount: transaction.amount,
      },
      status: "pending",
    })

    if (alertError) {
      console.error("Error creating admin alert:", alertError)
    }

    return NextResponse.json({ message: "Transaction flagged successfully", transaction })
  } catch (error) {
    console.error("Unexpected error in transaction flagging:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

