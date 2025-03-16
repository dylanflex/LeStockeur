import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const { reviewNotes } = await request.json();
    const auditId = context.params.id;

    // Verify reviewer exists
    const reviewer = await prisma.user.findUnique({ where: { id: userId } });
    if (!reviewer) {
      return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
    }

    // Verify audit exists and is in PENDING status
    const existingAudit = await prisma.inventoryAudit.findUnique({
      where: { id: auditId }
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    if (existingAudit.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending audits can be rejected" },
        { status: 400 }
      );
    }

    const audit = await prisma.$transaction(async (prisma) => {
      // Update the audit status
      const updatedAudit = await prisma.inventoryAudit.update({
        where: { id: auditId },
        data: {
          status: "REJECTED",
          reviewer: { connect: { id: userId } },
          notes: reviewNotes || ""
        },
        include: {
          items: { include: { product: true } },
          user: true,
          reviewer: true
        }
      });

      // Create audit history record
      await prisma.inventoryAuditHistory.create({
        data: {
          auditId,
          action: "STATUS_CHANGED",
          oldValue: "PENDING",
          newValue: "REJECTED",
          userId,
          createdAt: new Date()
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