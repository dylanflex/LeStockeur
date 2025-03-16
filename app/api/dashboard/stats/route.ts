import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get total products and stock value
    const products = await prisma.product.findMany();
    const totalProducts = products.length;
    const stockValue = products.reduce((total, product) => {
      return total + (product.currentStock * product.unitPrice);
    }, 0);

    // Get monthly inflow/outflow
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    // Get current month movements
    const currentMonthMovements = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    });

    // Get previous month movements
    const previousMonthMovements = await prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
          lte: new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0)
        }
      }
    });

    // Calculate inflow
    const currentMonthInflow = currentMonthMovements.filter(m => m.type === 'IN').length;
    const previousMonthInflow = previousMonthMovements.filter(m => m.type === 'IN').length;
    const inflowPercentage = previousMonthInflow === 0 ? 100 : 
      ((currentMonthInflow - previousMonthInflow) / previousMonthInflow) * 100;

    // Calculate outflow
    const currentMonthOutflow = currentMonthMovements.filter(m => m.type === 'OUT').length;
    const previousMonthOutflow = previousMonthMovements.filter(m => m.type === 'OUT').length;
    const outflowPercentage = previousMonthOutflow === 0 ? -100 :
      ((currentMonthOutflow - previousMonthOutflow) / previousMonthOutflow) * 100;

    const dashboardData = {
      totalProducts,
      stockValue,
      monthlyInflow: {
        count: currentMonthInflow,
        percentage: Number(inflowPercentage.toFixed(1))
      },
      monthlyOutflow: {
        count: currentMonthOutflow,
        percentage: Number(outflowPercentage.toFixed(1))
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}