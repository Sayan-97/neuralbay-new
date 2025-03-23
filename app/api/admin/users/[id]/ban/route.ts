import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const banReason = body.reason || "Violation of terms of service"

    // Update user status to 'banned'
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .update({
        status: "banned",
        ban_reason: banReason,
        banned_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error banning user:", error)
      return NextResponse.json({ error: "Failed to ban user" }, { status: 500 })
    }

    // Disable user's auth account
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(params.id, { banned: true })

    if (authError) {
      console.error("Error disabling user auth:", authError)
    }

    // Set all user's models to inactive
    const { error: modelsError } = await supabaseAdmin
      .from("models")
      .update({ status: "inactive" })
      .eq("vendor_id", params.id)

    if (modelsError) {
      console.error("Error updating user models:", modelsError)
    }

    return NextResponse.json({ message: "User banned successfully", user })
  } catch (error) {
    console.error("Unexpected error in user ban:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

