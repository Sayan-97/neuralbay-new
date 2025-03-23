import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Update user role to 'admin'
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .update({
        role: "admin",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error promoting user to admin:", error)
      return NextResponse.json({ error: "Failed to promote user to admin" }, { status: 500 })
    }

    // Send notification to the user
    const { error: notificationError } = await supabaseAdmin.from("notifications").insert({
      user_id: params.id,
      type: "role_change",
      title: "Role Updated",
      message: "You have been promoted to admin status.",
      data: { role: "admin" },
    })

    if (notificationError) {
      console.error("Error creating notification:", notificationError)
    }

    return NextResponse.json({ message: "User promoted to admin successfully", user })
  } catch (error) {
    console.error("Unexpected error in admin promotion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

