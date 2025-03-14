/*
  Warnings:

  - You are about to drop the column `actualStock` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `difference` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `InventoryAudit` table. All the data in the column will be lost.
  - You are about to drop the column `theoreticalStock` on the `InventoryAudit` table. All the data in the column will be lost.
  - Added the required column `status` to the `InventoryAudit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "InventoryAuditItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "theoreticalStock" INTEGER NOT NULL,
    "actualStock" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "notes" TEXT,
    "productId" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    CONSTRAINT "InventoryAuditItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryAuditItem_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "InventoryAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventoryAuditHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryAuditHistory_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "InventoryAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryAuditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InventoryAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "userId" TEXT,
    "reviewerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventoryAudit_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryAudit" ("createdAt", "date", "id", "notes", "userId") SELECT "createdAt", "date", "id", "notes", "userId" FROM "InventoryAudit";
DROP TABLE "InventoryAudit";
ALTER TABLE "new_InventoryAudit" RENAME TO "InventoryAudit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
