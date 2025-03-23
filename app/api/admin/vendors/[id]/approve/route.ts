import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Update vendor status to 'approved'
    const { data: vendor, error } = await supabaseAdmin
      .from("users")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("role", "vendor")
      .select()
      .single()

    if (error) {
      console.error("Error approving vendor:", error)
      return NextResponse.json({ error: "Failed to approve vendor" }, { status: 500 })
    }

    // Send notification to the vendor
    const { error: notificationError } = await supabaseAdmin.from("notifications").insert({
      user_id: params.id,
      type: "vendor_approved",
      title: "Vendor Application Approved",
      message: "Your vendor application has been approved. You can now publish AI models to the marketplace.",
      data: {},
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
    }

    return NextResponse.json({ message: "Vendor approved successfully", vendor })
  } catch (error) {
    console.error("Unexpected error in vendor approval:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

