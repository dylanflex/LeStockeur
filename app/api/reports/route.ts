import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';

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

    const { reportType, startDate, endDate, productId } = await request.json();

    let reportData;
    switch (reportType) {
      case 'inventory_status':
        reportData = await prisma.product.findMany({
          where: productId ? { id: productId } : {},
          select: {
            id: true,
            name: true,
            code: true,
            currentStock: true,
            minimumStock: true,
            category: true,
            location: true
          }
        });
        break;

      case 'movement_history':
        reportData = await prisma.stockMovement.findMany({
          where: {
            date: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            },
            productId: productId || undefined
          },
          include: {
            product: true,
            user: true
          },
          orderBy: {
            date: 'desc'
          }
        });
        break;

      case 'audit_summary':
        reportData = await prisma.inventoryAudit.findMany({
          where: {
            date: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            },
            user: true,
            reviewer: true
          },
          orderBy: {
            date: 'desc'
          }
        });
        break;

      case 'low_stock_alert':
        reportData = await prisma.product.findMany({
          where: {
            currentStock: {
              lte: prisma.product.fields.minimumStock
            }
          },
          select: {
            id: true,
            name: true,
            code: true,
            currentStock: true,
            minimumStock: true,
            category: true,
            location: true
          }
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid report type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        type: reportType,
        generatedAt: new Date(),
        results: reportData
      }
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    );
  }
}