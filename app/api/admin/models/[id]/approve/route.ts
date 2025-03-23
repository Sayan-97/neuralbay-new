import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Update model status to 'live'
    const { data: model, error } = await supabaseAdmin
      .from("models")
      .update({ status: "live", approved_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error approving model:", error)
      return NextResponse.json({ error: "Failed to approve model" }, { status: 500 })
    }

    // Send notification to the vendor
    const { error: notificationError } = await supabaseAdmin.from("notifications").insert({
      user_id: model.vendor_id,
      type: "model_approved",
      title: "Model Approved",
      message: `Your model "${model.name}" has been approved and is now live on the marketplace.`,
      data: { model_id: model.id },
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
    }

    return NextResponse.json({ message: "Model approved successfully", model })
  } catch (error) {
    console.error("Unexpected error in model approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

