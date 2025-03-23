import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Get a specific model
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data: model, error } = await supabaseAdmin
      .from("models")
      .select(`
        *,
        vendors:vendor_id(id, name, email),
        categories:category_id(id, name)
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching model:", error)
      return NextResponse.json({ error: "Failed to fetch model" }, { status: 500 })
    }

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error("Unexpected error in model details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update a model
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const { data: model, error } = await supabaseAdmin.from("models").update(body).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating model:", error)
      return NextResponse.json({ error: "Failed to update model" }, { status: 500 })
    }

    return NextResponse.json(model)
  } catch (error) {
    console.error("Unexpected error in model update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Delete a model
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // First, delete any associated files in storage
    const { data: modelFiles, error: filesError } = await supabaseAdmin
      .from("model_files")
      .select("file_path")
      .eq("model_id", params.id)

    if (filesError) {
      console.error("Error fetching model files:", filesError)
    } else if (modelFiles && modelFiles.length > 0) {
      // Delete files from storage
      for (const file of modelFiles) {
        const { error: storageError } = await supabaseAdmin.storage.from("model-files").remove([file.file_path])

        if (storageError) {
          console.error("Error deleting file from storage:", storageError)
        }
      }

      // Delete file records
      const { error: deleteFilesError } = await supabaseAdmin.from("model_files").delete().eq("model_id", params.id)

      if (deleteFilesError) {
        console.error("Error deleting model file records:", deleteFilesError)
      }
    }

    // Delete the model
    const { error: deleteError } = await supabaseAdmin.from("models").delete().eq("id", params.id)

    if (deleteError) {
      console.error("Error deleting model:", deleteError)
      return NextResponse.json({ error: "Failed to delete model" }, { status: 500 })
    }

    return NextResponse.json({ message: "Model deleted successfully" })
  } catch (error) {
    console.error("Unexpected error in model deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

