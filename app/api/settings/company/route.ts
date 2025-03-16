import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.companySettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching company settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch company settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { name, email, address, phone, userId } = data;

    // Validate required fields
    if (!name || !email || !address || !phone || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get existing settings or create new one
    const existingSettings = await prisma.companySettings.findFirst();

    const settings = await prisma.companySettings.upsert({
      where: {
        id: existingSettings?.id || "",
      },
      update: {
        name,
        email,
        address,
        phone,
        userId
      },
      create: {
        name,
        email,
        address,
        phone,
        userId
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating company settings:", error);
    return NextResponse.json(
      { error: "Failed to update company settings" },
      { status: 500 }
    );
  }
}