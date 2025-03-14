import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const lowStockProducts = await prisma.product.findMany({
      where: {
        OR: [
          // Produits avec stock nul ou négatif
          {
            currentStock: {
              lte: 0
            }
          },
          // Produits où le stock actuel est inférieur au stock minimum
          {
            AND: [
              { minimumStock: { gt: 0 } },
              {
                currentStock: {
                  lt: {
                    minimumStock: true
                  }
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        currentStock: true,
        minimumStock: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: [
        {
          currentStock: "asc"
        }
      ]
    });

    const formattedProducts = lowStockProducts.map(product => ({
      id: product.id,
      nom: product.name,
      stockActuel: product.currentStock,
      stockMinimum: product.minimumStock,
      type: product.category?.name || "Non catégorisé",
      dateCreation: new Date(product.createdAt).toLocaleDateString("fr-FR"),
      dateMiseAJour: new Date(product.updatedAt).toLocaleDateString("fr-FR"),
      raison: product.currentStock <= 0 ? "Stock épuisé" : "Stock faible"
    }));

    return NextResponse.json({ success: true, data: formattedProducts });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits en stock faible:", error);
    return NextResponse.json(
      { error: "Échec de la récupération des produits en stock faible" },
      { status: 500 }
    );
  }
}