import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const { reviewNotes } = await request.json();
    const auditId = context.params.id; // Correction ici

    // Vérification que le reviewer existe
    const reviewer = await prisma.user.findUnique({ where: { id: userId } });
    if (!reviewer) {
      return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
    }

    // Mise à jour de l'audit dans une transaction
    const audit = await prisma.$transaction(async (prisma) => {
      // Mise à jour de l'audit
      const updatedAudit = await prisma.inventoryAudit.update({
        where: { id: auditId },
        data: {
          status: "APPROVED",
          reviewer: { connect: { id: userId } },
          notes: reviewNotes || "",
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
          userId
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
