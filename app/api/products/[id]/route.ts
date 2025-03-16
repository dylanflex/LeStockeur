import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!params?.id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        stockMovements: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.code || !data.name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if code is being changed and if new code already exists
    if (data.code !== existingProduct.code) {
      const productWithCode = await prisma.product.findUnique({
        where: { code: data.code }
      });
      
      if (productWithCode) {
        return NextResponse.json(
          { error: 'Product with this code already exists' },
          { status: 400 }
        );
      }
    }
    
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        code: data.code,
        name: data.name,
        description: data.description,
        category: data.category,
        unitPrice: parseFloat(data.unitPrice) || 0,
        minimumStock: parseInt(data.minimumStock) || 0,
        location: data.location
      }
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    await prisma.product.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}