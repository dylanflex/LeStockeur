import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const { reviewNotes } = await request.json();
    const auditId = params.id;

    // Verify reviewer exists
    const reviewer = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!reviewer) {
      return NextResponse.json(
        { error: "Reviewer not found" },
        { status: 404 }
      );
    }

    // Update audit status and create history in a transaction
    const audit = await prisma.$transaction(async (prisma) => {
      // Update the audit status
      const updatedAudit = await prisma.inventoryAudit.update({
        where: { id: auditId },
        data: {
          status: 'REJECTED',
          reviewer: {
            connect: { id: reviewerId }
          },
          notes: reviewNotes || "",
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

      // Create audit history entry for status change
      await prisma.inventoryAuditHistory.create({
        data: {
          auditId,
          action: "STATUS_CHANGED",
          oldValue: "PENDING",
          newValue: "REJECTED",
          userId: reviewerId,
          notes: reviewNotes || "No reason provided"
        }
      });

      return updatedAudit;
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Error rejecting audit:", error);
    return NextResponse.json(
      { error: "Failed to reject audit" },
      { status: 500 }
    );
  }
}