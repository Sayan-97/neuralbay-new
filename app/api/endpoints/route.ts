import { prisma } from "@/lib/db";
import { ServerError, errorHandler } from "@/lib/utils";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const createEndpointSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.optional(z.string()),
  method: z.optional(z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"])),
  headers: z.optional(z.record(z.string(), z.any())),
  body: z.optional(z.any()),
  parameters: z.optional(z.record(z.string(), z.any())),
  isStatus: z.optional(z.boolean()),
  input: z.string(),
  output: z.string(),
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const jsonData = await req.json();
    const parsedData = createEndpointSchema.parse(jsonData);

    // const session = await getServerSession(authOptions);
    // if (!session || !session.user) {
    //   throw new ServerError("Unauthorized", 401);
    // }
    const endpointData = {
      ...parsedData,
    };
    const endpoint = await prisma.endpoint.create({
      data: endpointData,
    });

    return NextResponse.json(endpoint, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    let endpoints;

    if (id) {
      endpoints = await prisma.endpoint.findUnique({
        where: { id },
      });

      if (!endpoints) {
        return NextResponse.json(
          { message: "Endpoint not found" },
          { status: 404 }
        );
      }
    } else {
      endpoints = await prisma.endpoint.findMany();
    }

    return NextResponse.json(endpoints);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID is required for deletion" },
        { status: 400 }
      );
    }

    const existingEndpoint = await prisma.endpoint.findUnique({
      where: { id },
    });

    if (!existingEndpoint) {
      return NextResponse.json(
        { message: "Endpoint not found" },
        { status: 404 }
      );
    }

    await prisma.endpoint.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Endpoint deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
