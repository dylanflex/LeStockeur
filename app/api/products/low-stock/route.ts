import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        currentStock: true,
        minimumStock: true,
        createdAt: true,
        updatedAt: true,
        productCategory: {  // Correct : On récupère la relation avec ProductCategory
          select: {
            name: true
          }
        }
      },
      orderBy: {
        currentStock: "asc"
      }
    });

    // 🔥 Filtrer côté serveur pour comparer currentStock et minimumStock
    const lowStockProducts = products
      .filter((product) =>
        product.currentStock <= 0 || // Rupture de stock
        (product.minimumStock > 0 && product.currentStock < product.minimumStock) // Stock insuffisant
      )
      .map((product) => ({
        ...product,
        category: product.productCategory ? product.productCategory.name : null, // Correction ici
      }));

    return NextResponse.json({ success: true, data: lowStockProducts });

  } catch (error) {
    console.error("Error fetching low stock products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch low stock products" },
      { status: 500 }
    );
  }
}
