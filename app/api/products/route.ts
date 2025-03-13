import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const session = await auth();
    console.log('Session:', JSON.stringify(session, null, 2));

    if (!session || !session.userId) {
      console.log('Authentication failed: No valid session');
      return NextResponse.json(
        { success: false, error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const claims = session.sessionClaims;
    console.log('Session claims:', JSON.stringify(claims, null, 2));

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    console.log('Database user:', JSON.stringify(user, null, 2));

    if (!user) {
      console.log('User not found in database for ID:', session.userId);
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    console.log('Searching for products with userId:', user.id);
    const products = await prisma.product.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        code: true,
        name: true,
        category: true,
        unitPrice: true,
        currentStock: true,
        minimumStock: true,
        description: true,
        location: true
      }
    });
    console.log('Found products:', JSON.stringify(products, null, 2));

    // Validate the products data structure
    const validatedProducts = products.map(product => ({
      id: product.id,
      code: product.code,
      name: product.name,
      category: product.category || "",
      unitPrice: Number(product.unitPrice) || 0,
      currentStock: Number(product.currentStock) || 0,
      minimumStock: Number(product.minimumStock) || 0,
      description: product.description || "",
      location: product.location || ""
    }));

    return NextResponse.json({ success: true, data: validatedProducts });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
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

    // Use Clerk's user ID directly for authentication
    if (!session.userId) {
      return NextResponse.json(
        { success: false, error: "User ID not found in session" },
        { status: 401 }
      );
    }

    // Find user by Clerk ID
    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    // Get product data
    const data = await request.json();
    const requiredFields = ["code", "name"];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { code: data.code },
    });

    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: `Product with code ${data.code} already exists` },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description || "",
        category: data.category || "",
        unitPrice: parseFloat(data.unitPrice) || 0,
        minimumStock: parseInt(data.minimumStock) || 0,
        currentStock: parseInt(data.initialStock) || 0,
        location: data.location || "",
        userId: user.id,
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
export async function checkAndAddUser(email: string, name: string, userId: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      // Create a new user if not found
      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          name
        }
      });
    }

    return user;
  } catch (error) {
    console.error("Error checking/creating user:", error);
    throw error;
  }
}
