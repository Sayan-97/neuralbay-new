import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Get a specific user
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        models:models(id, name, status),
        transactions:transactions(id, amount, status, created_at)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Unexpected error in user details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update a user
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const { data: user, error } = await supabaseAdmin.from("users").update(body).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Unexpected error in user update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete a user
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // First, check if user has any models
    const { data: userModels, error: modelsError } = await supabaseAdmin
      .from("models")
      .select("id")
      .eq("vendor_id", params.id)

    if (modelsError) {
      console.error("Error checking user models:", modelsError)
    } else if (userModels && userModels.length > 0) {
      // Delete all user's models
      for (const model of userModels) {
        // Delete model files
        const { data: modelFiles, error: filesError } = await supabaseAdmin
          .from("model_files")
          .select("file_path")
          .eq("model_id", model.id)

        if (filesError) {
          console.error("Error fetching model files:", filesError)
        } else if (modelFiles && modelFiles.length > 0) {
          // Delete files from storage
          for (const file of modelFiles) {
            await supabaseAdmin.storage.from("model-files").remove([file.file_path])
          }

          // Delete file records
          await supabaseAdmin.from("model_files").delete().eq("model_id", model.id)
        }

        // Delete the model
        await supabaseAdmin.from("models").delete().eq("id", model.id)
      }
    }

    // Delete user's profile picture if exists
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("avatar_url")
      .eq("id", params.id)
      .single()

    if (!userError && userData && userData.avatar_url) {
      const avatarPath = userData.avatar_url.split("/").pop()
      if (avatarPath) {
        await supabaseAdmin.storage.from("avatars").remove([avatarPath])
      }
    }

    // Delete user's transactions
    await supabaseAdmin.from("transactions").delete().eq("user_id", params.id)

    // Delete user's notifications
    await supabaseAdmin.from("notifications").delete().eq("user_id", params.id)

    // Finally, delete the user
    const { error: deleteError } = await supabaseAdmin.from("users").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    // Delete the user from auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(params.id)

    if (authError) {
      console.error("Error deleting user from auth:", authError)
      return NextResponse.json({ error: "User deleted from database but not from auth" }, { status: 500 })
    }

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Unexpected error in user deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

