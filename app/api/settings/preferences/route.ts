import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const preferences = await prisma.appPreferences.findFirst();
    return NextResponse.json(preferences, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error fetching app preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch app preferences" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { language, dateFormat, currency, itemsPerPage, userId } = data;

    // Validate required fields
    if (!language || !dateFormat || !currency || !itemsPerPage || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get existing preferences or create new one
    const existingPreferences = await prisma.appPreferences.findFirst();

    if (!existingPreferences) {
      // Create new preferences
      const preferences = await prisma.appPreferences.create({
        data: {
          language,
          dateFormat,
          currency,
          itemsPerPage,
          userId
        },
      });
      return NextResponse.json(preferences, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Update existing preferences
    const preferences = await prisma.appPreferences.update({
      where: {
        id: existingPreferences.id,
      },
      update: {
        language,
        dateFormat,
        currency,
        itemsPerPage,
        userId
      },
      create: {
        language,
        dateFormat,
        currency,
        itemsPerPage,
        userId
      },
    });

    return NextResponse.json(preferences, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error updating app preferences:", error);
    return NextResponse.json(
      { error: "Failed to update app preferences" },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}