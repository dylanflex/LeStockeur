"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { 
  Product, 
  StockMovement, 
  MovementType, 
  InventoryAudit 
} from "@prisma/client";


export async function checkAndAddUser(email: string, name: string, clerkId: string) {
  if (!email) return;
  try {
      const existingUser = await prisma.user.findUnique({
          where: {
              email: email
          }
      })

      if (!existingUser && name) {
          await prisma.user.create({
              data: {
                  email,
                  name,
                  id: clerkId // Use Clerk ID as the user ID
              }
          })
      }

  } catch (error) {
      console.error(error)
  }
}

// Function to find user by Clerk ID
export async function findUserById(clerkId: string) {
  if (!clerkId) return null;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: clerkId
      }
    });
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

// Product actions
export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  try {
    // Ensure user exists before creating product
    if (data.userId) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId }
      });
      
      if (!user) {
        return { success: false, error: "User not found" };
      }
    }

    const product = await prisma.product.create({
      data: {
        ...data,
      },
    });
    
    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    
    revalidatePath(`/products/${id}`);
    revalidatePath("/products");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products" };
  }
}

export async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return { success: false, error: "Product not found" };
    }
    
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Failed to fetch product" };
  }
}

// Stock movement actions
export async function createStockMovement(data: {
  productId: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  notes?: string;
  userId?: string;
}) {
  try {
    const { productId, type, quantity, reason, notes, userId } = data;
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the current product
      const product = await tx.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Calculate the new stock level
      let newStock = product.currentStock;
      
      if (type === "PURCHASE" || type === "PRODUCTION" || type === "RETURN") {
        newStock += quantity;
      } else if (type === "SALE" || type === "INTERNAL_USE" || type === "WASTE") {
        if (product.currentStock < quantity) {
          throw new Error("Insufficient stock");
        }
        newStock -= quantity;
      } else if (type === "ADJUSTMENT") {
        // For adjustments, the quantity can be positive or negative
        newStock += quantity;
        if (newStock < 0) {
          throw new Error("Adjustment would result in negative stock");
        }
      }
      
      // Create the stock movement
      const movement = await tx.stockMovement.create({
        data: {
          type,
          quantity,
          reason,
          notes,
          userId,
          productId,
        },
      });
      
      // Update the product's stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { currentStock: newStock },
      });
      
      return { movement, updatedProduct };
    });
    
    revalidatePath("/movements");
    revalidatePath(`/products/${productId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating stock movement:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create stock movement" 
    };
  }
}

export async function getStockMovements(productId?: string) {
  try {
    const movements = await prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: { product: true },
      orderBy: { date: "desc" },
    });
    
    return { success: true, data: movements };
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    return { success: false, error: "Failed to fetch stock movements" };
  }
}

// Inventory audit actions
export async function createInventoryAudit(data: {
  productId: string;
  actualStock: number;
  notes?: string;
  userId?: string;
}) {
  try {
    const { productId, actualStock, notes, userId } = data;
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get the current product
      const product = await tx.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Create the audit record
      const audit = await tx.inventoryAudit.create({
        data: {
          productId,
          actualStock,
          discrepancy: actualStock - product.currentStock,
          notes,
          userId
        },
      });
      
      // Update the product's stock
      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { currentStock: actualStock },
      });
      
      return { audit, updatedProduct };
    });
    
    revalidatePath("/audits");
    revalidatePath(`/products/${productId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating inventory audit:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create inventory audit" 
    };
  }
  }