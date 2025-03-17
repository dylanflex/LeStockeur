import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const audits = await prisma.inventoryAudit.findMany({
      orderBy: { date: "desc" },
      include: {
        items: { include: { product: true } },
        user: true,
        reviewer: true
      }
    });

    return NextResponse.json({ success: true, data: audits });
  } catch (error) {
    console.error("Error fetching audits:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const data = await request.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, error: "Invalid request data format" },
        { status: 400 }
      );
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one audit item is required" },
        { status: 400 }
      );
    }

    // Validate each item in the array
    for (const item of data.items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return NextResponse.json(
          { success: false, error: "Each audit item must have a valid productId" },
          { status: 400 }
        );
      }

      if (typeof item.theoreticalStock !== 'number' || typeof item.actualStock !== 'number') {
        return NextResponse.json(
          { success: false, error: "Stock values must be numbers" },
          { status: 400 }
        );
      }

      // Verify product exists
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with id ${item.productId} not found` },
          { status: 404 }
        );
      }
    }

    const audit = await prisma.$transaction(async (prisma) => {
      const newAudit = await prisma.inventoryAudit.create({
        data: {
          date: new Date(data.date || new Date()),
          status: "PENDING",
          notes: data.notes || "",
          userId: user.id,
          items: {
            create: data.items.map((item: { theoreticalStock: number; actualStock: number; notes?: string; productId: string }) => ({
              theoreticalStock: item.theoreticalStock,
              actualStock: item.actualStock,
              difference: item.actualStock - item.theoreticalStock,
              notes: item.notes || "",
              productId: item.productId,
            })),
          },
        },
        include: { items: { include: { product: true } }, user: true },
      });

      await prisma.inventoryAuditHistory.create({
        data: {
          auditId: newAudit.id,
          action: "CREATED",
          oldValue: null,
          newValue: "PENDING",
          userId: user.id,
        },
      });

      await Promise.all(
        newAudit.items.map((item) =>
          prisma.inventoryAuditHistory.create({
            data: {
              auditId: newAudit.id,
              action: "ITEM_ADDED",
              oldValue: item.theoreticalStock.toString(),
              newValue: item.actualStock.toString(),
              userId: user.id,
            },
          })
        )
      );

      return newAudit;
    });

    return NextResponse.json({ success: true, data: audit });
  } catch (error) {
    console.error("Error creating audit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
