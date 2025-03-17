import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Authentication failed - Please sign in with a valid account" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const { reportType, startDate, endDate, productId, exportFormat } = await request.json();

    if (!reportType) {
      return NextResponse.json(
        { success: false, error: "Report type is required" },
        { status: 400 }
      );
    }

    let reportData;
    switch (reportType) {
      case 'overview':
      case 'inventory':
        reportData = await prisma.product.findMany({
          where: productId ? { id: productId } : {},
          select: {
            id: true,
            name: true,
            code: true,
            currentStock: true,
            minimumStock: true,
            category: true,
            location: true
          }
        });
        break;

      case 'movements':
        reportData = await prisma.stockMovement.findMany({
          where: {
            date: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined
            },
            productId: productId || undefined
          },
          include: {
            product: true,
            user: true
          },
          orderBy: {
            date: 'desc'
          }
        });
        break;

      case 'financial':
        reportData = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            currentStock: true,
            unitPrice: true,
            category: true
          }
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: `Invalid report type: ${reportType}` },
          { status: 400 }
        );
    }

    if (exportFormat) {
      let fileContent = '';
      const headers = new Headers();
      
      if (exportFormat === 'csv') {
        headers.set('Content-Type', 'text/csv');
        headers.set('Content-Disposition', `attachment; filename=${reportType}-report.csv`);
        
        // Convert report data to CSV
        const keys = Object.keys(reportData[0] || {});
        fileContent = keys.join(',') + '\n';
        fileContent += reportData.map(item => 
          keys.map(key => {
            // Type assertion to handle dynamic property access
            const value = (item as Record<string, unknown>)[key];
            return JSON.stringify(value);
          }).join(',')
        ).join('\n');
        
        return new NextResponse(fileContent, { headers });
      }
      
      if (exportFormat === 'json') {
        headers.set('Content-Type', 'application/json');
        headers.set('Content-Disposition', `attachment; filename=${reportType}-report.json`);
        fileContent = JSON.stringify(reportData, null, 2);
        
        return new NextResponse(fileContent, { headers });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        type: reportType,
        generatedAt: new Date().toISOString(),
        results: reportData
      }
    });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate report"
      },
      { status: 500 }
    );
  }
}