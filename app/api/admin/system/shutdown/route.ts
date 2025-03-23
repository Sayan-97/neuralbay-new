import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reason = body.reason || "Emergency maintenance"
    const estimatedDuration = body.estimatedDuration || "1 hour"

    // Update system status in the settings table
    const { error } = await supabaseAdmin.from("system_settings").upsert({
      key: "system_status",
      value: {
        status: "maintenance",
        reason: reason,
        estimated_duration: estimatedDuration,
        started_at: new Date().toISOString(),
      },
    })

    if (error) {
      console.error("Error updating system status:", error)
      return NextResponse.json({ error: "Failed to initiate system shutdown" }, { status: 500 })
    }

    // Log the shutdown event
    const { error: logError } = await supabaseAdmin.from("admin_logs").insert({
      action: "system_shutdown",
      details: {
        reason: reason,
        estimated_duration: estimatedDuration,
      },
      performed_by: body.adminId || "unknown",
    })

    if (logError) {
      console.error("Error logging shutdown:", logError)
    }

    return NextResponse.json({
      message: "System shutdown initiated successfully",
      details: {
        status: "maintenance",
        reason: reason,
        estimated_duration: estimatedDuration,
        started_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Unexpected error in system shutdown:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

