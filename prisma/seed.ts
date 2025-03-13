import { PrismaClient, MovementType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: UserRole.ADMIN,
    },
  });
  
  const manager = await prisma.user.create({
    data: {
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: UserRole.MANAGER,
    },
  });
  
  const user1 = await prisma.user.create({
    data: {
      name: 'Pierre Durand',
      email: 'pierre.durand@example.com',
      role: UserRole.USER,
    },
  });
  
  const user2 = await prisma.user.create({
    data: {
      name: 'Sophie Petit',
      email: 'sophie.petit@example.com',
      role: UserRole.USER,
    },
  });
  
  // Create products
  const product1 = await prisma.product.create({
    data: {
      code: 'PRD001',
      name: 'Écran LCD 24"',
      description: 'Écran LCD 24 pouces Full HD (1920x1080) avec technologie IPS et temps de réponse de 5ms.',
      category: 'Écrans',
      unitPrice: 149.99,
      minimumStock: 10,
      currentStock: 25,
      location: 'Étagère A3',
    },
  });
  
  const product2 = await prisma.product.create({
    data: {
      code: 'PRD002',
      name: 'Clavier mécanique',
      description: 'Clavier mécanique avec switches Cherry MX Blue, rétroéclairage RGB et disposition AZERTY.',
      category: 'Périphériques',
      unitPrice: 89.99,
      minimumStock: 5,
      currentStock: 15,
      location: 'Étagère B2',
    },
  });
  
  const product3 = await prisma.product.create({
    data: {
      code: 'PRD003',
      name: 'Câble USB-C 1m',
      description: 'Câble USB-C vers USB-A 3.0 de 1 mètre, compatible charge rapide.',
      category: 'Câbles',
      unitPrice: 12.99,
      minimumStock: 15,
      currentStock: 5,
      location: 'Tiroir C1',
    },
  });
  
  const product4 = await prisma.product.create({
    data: {
      code: 'PRD004',
      name: 'Souris sans fil',
      description: 'Souris sans fil ergonomique avec capteur optique 1600 DPI et autonomie de 12 mois.',
      category: 'Périphériques',
      unitPrice: 29.99,
      minimumStock: 8,
      currentStock: 20,
      location: 'Étagère B1',
    },
  });
  
  const product5 = await prisma.product.create({
    data: {
      code: 'PRD005',
      name: 'Adaptateur HDMI-VGA',
      description: 'Adaptateur HDMI vers VGA pour connecter des appareils HDMI à des écrans VGA.',
      category: 'Adaptateurs',
      unitPrice: 19.99,
      minimumStock: 10,
      currentStock: 3,
      location: 'Tiroir C2',
    },
  });
  
  // Create stock movements
  await prisma.stockMovement.create({
    data: {
      type: MovementType.PURCHASE,
      quantity: 15,
      reason: 'Achat',
      notes: 'Commande #ORD-2025-042',
      date: new Date('2025-04-12T14:30:00Z'),
      productId: product1.id,
      userId: admin.id,
    },
  });
  
  await prisma.stockMovement.create({
    data: {
      type: MovementType.SALE,
      quantity: 5,
      reason: 'Vente',
      notes: 'Facture #INV-2025-128',
      date: new Date('2025-04-11T09:15:00Z'),
      productId: product2.id,
      userId: manager.id,
    },
  });
  
  await prisma.stockMovement.create({
    data: {
      type: MovementType.PRODUCTION,
      quantity: 20,
      reason: 'Production',
      notes: 'Lot #PRD-2025-015',
      date: new Date('2025-04-10T11:45:00Z'),
      productId: product4.id,
      userId: user1.id,
    },
  });
  
  await prisma.stockMovement.create({
    data: {
      type: MovementType.SALE,
      quantity: 8,
      reason: 'Vente',
      notes: 'Facture #INV-2025-127',
      date: new Date('2025-04-09T16:20:00Z'),
      productId: product3.id,
      userId: user2.id,
    },
  });
  
  await prisma.stockMovement.create({
    data: {
      type: MovementType.ADJUSTMENT,
      quantity: -2,
      reason: 'Inventaire',
      notes: 'Ajustement après inventaire mensuel',
      date: new Date('2025-04-08T10:00:00Z'),
      productId: product5.id,
      userId: admin.id,
    },
  });
  
  // Create inventory audits
  await prisma.inventoryAudit.create({
    data: {
      date: new Date('2025-03-31T15:00:00Z'),
      theoreticalStock: 30,
      actualStock: 25,
      difference: -5,
      notes: 'Écart constaté lors de l\'inventaire mensuel',
      productId: product1.id,
      userId: admin.id,
    },
  });
  
  await prisma.inventoryAudit.create({
    data: {
      date: new Date('2025-03-31T15:30:00Z'),
      theoreticalStock: 15,
      actualStock: 15,
      difference: 0,
      notes: 'Aucun écart',
      productId: product2.id,
      userId: admin.id,
    },
  });
  
  await prisma.inventoryAudit.create({
    data: {
      date: new Date('2025-03-31T16:00:00Z'),
      theoreticalStock: 8,
      actualStock: 5,
      difference: -3,
      notes: 'Écart constaté, possible vol ou erreur de saisie',
      productId: product3.id,
      userId: admin.id,
    },
  });
  
  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });