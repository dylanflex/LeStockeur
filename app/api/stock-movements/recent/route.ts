import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const recentMovements = await prisma.stockMovement.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        product: {
          select: {
            name: true
          }
        }
      }
    });

    const formattedMovements = recentMovements.map(movement => ({
      id: movement.id,
      type: movement.type.toLowerCase(),
      productName: movement.product.name,
      quantity: movement.quantity,
      date: movement.date.toISOString(),
      reason: movement.reason || ""
    }));

    return NextResponse.json(formattedMovements);
  } catch (error) {
    console.error("Error fetching recent movements:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent movements" },
      { status: 500 }
    );
  }
}