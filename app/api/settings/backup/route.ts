import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.backupSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching backup settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (data.autoBackupEnabled === undefined || !data.frequency || !data.retentionPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate frequency
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (!validFrequencies.includes(data.frequency)) {
      return NextResponse.json(
        { error: 'Invalid backup frequency' },
        { status: 400 }
      );
    }

    // Validate retention period
    if (typeof data.retentionPeriod !== 'number' || data.retentionPeriod < 1) {
      return NextResponse.json(
        { error: 'Invalid retention period' },
        { status: 400 }
      );
    }

    // Update or create backup settings
    const settings = await prisma.backupSettings.upsert({
      where: {
        id: (await prisma.backupSettings.findFirst())?.id || 'default',
      },
      update: {
        autoBackupEnabled: data.autoBackupEnabled,
        frequency: data.frequency,
        retentionPeriod: data.retentionPeriod
      },
      create: {
        autoBackupEnabled: data.autoBackupEnabled,
        frequency: data.frequency,
        retentionPeriod: data.retentionPeriod
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating backup settings:', error);
    return NextResponse.json(
      { error: 'Failed to update backup settings' },
      { status: 500 }
    );
  }
}