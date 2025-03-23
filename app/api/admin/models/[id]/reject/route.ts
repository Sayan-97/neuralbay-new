import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const rejectionReason = body.reason || "Does not meet marketplace standards"

    // Update model status to 'rejected'
    const { data: model, error } = await supabaseAdmin
      .from("models")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        rejected_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error rejecting model:", error)
      return NextResponse.json({ error: "Failed to reject model" }, { status: 500 })
    }

    // Send notification to the vendor
    const { error: notificationError } = await supabaseAdmin.from("notifications").insert({
      user_id: model.vendor_id,
      type: "model_rejected",
      title: "Model Rejected",
      message: `Your model "${model.name}" has been rejected. Reason: ${rejectionReason}`,
      data: { model_id: model.id, reason: rejectionReason },
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
    }

    return NextResponse.json({ message: "Model rejected successfully", model })
  } catch (error) {
    console.error("Unexpected error in model rejection:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

