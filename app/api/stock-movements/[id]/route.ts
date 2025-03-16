import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const movement = await prisma.stockMovement.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: {
            id: true,
            code: true,
            name: true,
            currentStock: true,
            location: true
          }
        }
      }
    });
    
    if (!movement) {
      return NextResponse.json(
        { error: 'Mouvement non trouvé' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(movement);
  } catch (error) {
    console.error('Error fetching stock movement:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer le mouvement de stock' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { type, quantity, reason, notes, date, productId } = body;

    // Validate required fields
    if (!type || !quantity || !date || !productId) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Get the original movement
    const originalMovement = await prisma.stockMovement.findUnique({
      where: { id: params.id },
      include: { product: true }
    });

    if (!originalMovement) {
      return NextResponse.json(
        { error: 'Mouvement non trouvé' },
        { status: 404 }
      );
    }

    // Calculate stock difference
    const stockDifference = quantity - originalMovement.quantity;
    const stockChange = type === 'IN' ? stockDifference : -stockDifference;

    // Start a transaction to update both movement and product stock
    const result = await prisma.$transaction(async (prisma) => {
      // Update the movement
      const updatedMovement = await prisma.stockMovement.update({
        where: { id: params.id },
        data: {
          type,
          quantity,
          reason,
          notes,
          date: new Date(date),
          productId
        },
        include: { product: true }
      });

      // Update the product's stock
      await prisma.product.update({
        where: { id: productId },
        data: {
          currentStock: {
            increment: stockChange
          }
        }
      });

      return updatedMovement;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating stock movement:', error);
    return NextResponse.json(
      { error: 'Impossible de mettre à jour le mouvement de stock' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Get the movement first to check if it exists and get its details
    const movement = await prisma.stockMovement.findUnique({
      where: { id: params.id }
    });
    
    if (!movement) {
      return NextResponse.json(
        { error: 'Movement not found' },
        { status: 404 }
      );
    }
    
    // Start a transaction to update both stock movement and product stock
    const result = await prisma.$transaction(async (prisma) => {
      // Delete the movement
      await prisma.stockMovement.delete({
        where: { id: params.id }
      });
      
      // Revert the product's stock
      await prisma.product.update({
        where: { id: movement.productId },
        data: {
          currentStock: {
            decrement: movement.quantity
          }
        }
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stock movement:', error);
    return NextResponse.json(
      { error: 'Failed to delete stock movement' },
      { status: 500 }
    );
  }
}