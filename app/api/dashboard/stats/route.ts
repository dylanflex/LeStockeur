import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Replace with actual database queries
    const mockData = {
      totalProducts: 150,
      stockValue: 75000,
      monthlyInflow: {
        count: 45,
        percentage: 12.5
      },
      monthlyOutflow: {
        count: 32,
        percentage: -8.3
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}