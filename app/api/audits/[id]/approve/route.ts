import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server"; // ✅ Correction ici

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth(); // ✅ Correction ici
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const { reviewNotes } = await request.json();
    const { id: auditId } = await context.params;

    // Vérification que le reviewer existe
    const reviewer = await prisma.user.findUnique({ where: { id: userId } });
    if (!reviewer) {
      return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
    }

    // Mise à jour de l'audit dans une transaction
    // Verify audit exists and is in PENDING status
    const existingAudit = await prisma.inventoryAudit.findUnique({
      where: { id: auditId }
    });

    if (!existingAudit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    if (existingAudit.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending audits can be approved" },
        { status: 400 }
      );
    }

    const audit = await prisma.$transaction(async (prisma) => {
      // Mise à jour de l'audit
      const updatedAudit = await prisma.inventoryAudit.update({
        where: { id: auditId },
        data: {
          status: "APPROVED",
          reviewer: { connect: { id: userId } },
          notes: reviewNotes || ""
        },
        include: {
          items: { include: { product: true } },
          user: true,
          reviewer: true
        }
      });

      // Historique de la mise à jour
      await prisma.inventoryAuditHistory.create({
        data: {
          auditId,
          action: "STATUS_CHANGED",
          oldValue: "PENDING",
          newValue: "APPROVED",
          userId,
          createdAt: new Date()
        }
      });

      // Mise à jour des stocks
      await Promise.all(updatedAudit.items.map(item =>
        prisma.product.update({
          where: { id: item.productId },
          data: { currentStock: item.actualStock }
        })
      ));

      return updatedAudit;
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Error approving audit:", error);
    return NextResponse.json(
      { error: "Failed to approve audit" },
      { status: 500 }
    );
  }
}
