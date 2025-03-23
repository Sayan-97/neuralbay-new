import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Update system status in the settings table
    const { error } = await supabaseAdmin.from("system_settings").upsert({
      key: "system_status",
      value: {
        status: "operational",
        updated_at: new Date().toISOString(),
      },
    })

    if (error) {
      console.error("Error updating system status:", error)
      return NextResponse.json({ error: "Failed to restart system" }, { status: 500 })
    }

    // Log the restart event
    const body = await request.json()
    const { error: logError } = await supabaseAdmin.from("admin_logs").insert({
      action: "system_restart",
      details: {
        previous_status: "maintenance",
      },
      performed_by: body.adminId || "unknown",
    })

    if (logError) {
      console.error("Error logging restart:", logError)
    }

    return NextResponse.json({
      message: "System restarted successfully",
      details: {
        status: "operational",
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Unexpected error in system restart:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

