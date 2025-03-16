import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.notificationSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const {
      stockAlerts,
      criticalAlerts,
      expiryAlerts,
      emailEnabled,
      appEnabled,
      smsEnabled,
      userId
    } = data;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field: userId" },
        { status: 400 }
      );
    }

    // Get existing settings or create new one
    const existingSettings = await prisma.notificationSettings.findFirst();

    const settings = await prisma.notificationSettings.upsert({
      where: {
        id: existingSettings?.id || "",
      },
      update: {
        stockAlerts,
        criticalAlerts,
        expiryAlerts,
        emailEnabled,
        appEnabled,
        smsEnabled,
        userId
      },
      create: {
        stockAlerts,
        criticalAlerts,
        expiryAlerts,
        emailEnabled,
        appEnabled,
        smsEnabled,
        userId
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return NextResponse.json(
      { error: "Failed to update notification settings" },
      { status: 500 }
    );
  }
}