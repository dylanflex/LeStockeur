import { prisma } from '@/lib/prisma';

export class BackupService {
  private static instance: BackupService;

  private constructor() {}

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  async createBackup(type: 'manual' | 'automatic' = 'automatic'): Promise<void> {
    try {
      // Create a backup record
      const backup = await prisma.backup.create({
        data: {
          filename: `backup_${new Date().toISOString()}.json`,
          size: 0,
          type,
          status: 'pending'
        }
      });

      // Export data
      const data = await this.exportData();
      const size = Buffer.from(JSON.stringify(data)).length;

      // Update backup record
      await prisma.backup.update({
        where: { id: backup.id },
        data: {
          size,
          status: 'completed',
          completedAt: new Date()
        }
      });

      // Update last backup time in settings
      await prisma.backupSettings.update({
        where: {
          id: (await prisma.backupSettings.findFirst())?.id || 'default'
        },
        data: {
          lastBackupAt: new Date()
        }
      });
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  async cleanupOldBackups(): Promise<void> {
    try {
      const settings = await prisma.backupSettings.findFirst();
      if (!settings) return;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.retentionPeriod);

      await prisma.backup.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw new Error('Failed to cleanup old backups');
    }
  }

  private async exportData() {
    // Export all relevant data
    const [products, categories, companySettings, appPreferences, notificationSettings] = await Promise.all([
      prisma.product.findMany(),
      prisma.productCategory.findMany(),
      prisma.companySettings.findFirst(),
      prisma.appPreferences.findFirst(),
      prisma.notificationSettings.findFirst()
    ]);

    return {
      products,
      categories,
      companySettings,
      appPreferences,
      notificationSettings,
      exportedAt: new Date().toISOString()
    };
  }

  async scheduleNextBackup(): Promise<void> {
    const settings = await prisma.backupSettings.findFirst();
    if (!settings || !settings.autoBackupEnabled) return;

    const lastBackup = settings.lastBackupAt;
    const now = new Date();
    let nextBackup = new Date();

    switch (settings.frequency) {
      case 'daily':
        nextBackup.setDate(now.getDate() + 1);
        nextBackup.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        nextBackup.setDate(now.getDate() + 7);
        nextBackup.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        nextBackup.setMonth(now.getMonth() + 1);
        nextBackup.setDate(1);
        nextBackup.setHours(0, 0, 0, 0);
        break;
    }

    const delay = nextBackup.getTime() - now.getTime();
    setTimeout(() => {
      this.createBackup('automatic')
        .then(() => this.cleanupOldBackups())
        .then(() => this.scheduleNextBackup())
        .catch(console.error);
    }, delay);
  }
}

// Initialize backup service and schedule next backup
export const initializeBackupService = async () => {
  const backupService = BackupService.getInstance();
  await backupService.scheduleNextBackup();
};