import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const audit = await prisma.inventoryAudit.findUnique({
      where: { id: context.params.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        reviewer: true,
        history: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Error fetching audit:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { status, reviewNotes, userId } = data;

    // First validate that the user exists if userId is provided
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (!user) {
        return NextResponse.json(
          { error: "Invalid reviewer user ID" },
          { status: 400 }
        );
      }
    }

    const audit = await prisma.inventoryAudit.findUnique({
      where: { id: params.id }
    });

    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    // Update audit status and create history entry
    const updatedAudit = await prisma.$transaction(async (prisma) => {
      const updated = await prisma.inventoryAudit.update({
        where: { id: params.id },
        data: {
          status,
          notes: reviewNotes,
          reviewerId: status === 'DRAFT' ? null : userId,
          updatedAt: new Date()
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          reviewer: true
        }
      });

      await prisma.inventoryAuditHistory.create({
        data: {
          auditId: params.id,
          action: 'STATUS_CHANGED',
          oldValue: audit.status,
          newValue: status,
          userId
        }
      });

      return updated;
    });

    return NextResponse.json(updatedAudit);
  } catch (error) {
    console.error("Error updating audit:", error);
    return NextResponse.json(
      { error: "Failed to update audit" },
      { status: 500 }
    );
  }
}