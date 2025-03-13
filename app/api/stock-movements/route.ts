import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    const movements = await prisma.stockMovement.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: {
          select: {
            code: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    return NextResponse.json(movements);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.productId || !data.type || typeof data.quantity !== 'number') {
      return NextResponse.json(
        { error: 'Product ID, type, and quantity are required' },
        { status: 400 }
      );
    }
    
    // Start a transaction to update both stock movement and product stock
    const result = await prisma.$transaction(async (prisma) => {
      // Create the stock movement
      const movement = await prisma.stockMovement.create({
        data: {
          productId: data.productId,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          notes: data.notes,
          date: data.date ? new Date(data.date) : new Date()
        }
      });
      
      // Update the product's current stock
      const product = await prisma.product.update({
        where: { id: data.productId },
        data: {
          currentStock: {
            increment: data.quantity
          }
        }
      });
      
      return { movement, product };
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating stock movement:', error);
    return NextResponse.json(
      { error: 'Failed to create stock movement' },
      { status: 500 }
    );
  }
}