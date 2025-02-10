import { supabase } from "../../utils/supabaseClient";
import { ServerError, errorHandler } from "@/lib/utils";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const getAuthorizedUsersSchema = z.object({
  limit: z.optional(z.string()),
});

export async function GET(req: NextRequest) {
  try {
    const queryParams = getAuthorizedUsersSchema.safeParse(
      Object.fromEntries(new URL(req.url).searchParams)
    );
    if (!queryParams.success) {
      throw new ServerError("Invalid query parameters", 400);
    }

    const { data, error } = await supabase.from("authorized_users").select("*");

    if (error) {
      throw new ServerError(`Supabase error: ${error.message}`, 500);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
