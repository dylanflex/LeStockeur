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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventoryAudit_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryAudit" ("createdAt", "date", "id", "notes", "reviewerId", "status", "userId", "updatedAt") 
SELECT "createdAt", "date", "id", "notes", "reviewerId", "status", "userId", "createdAt" FROM "InventoryAudit";
DROP TABLE "InventoryAudit";
ALTER TABLE "new_InventoryAudit" RENAME TO "InventoryAudit";

CREATE TABLE "new_InventoryAuditHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryAuditHistory_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "InventoryAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventoryAuditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryAuditHistory" ("action", "auditId", "createdAt", "id", "newValue", "oldValue", "userId", "updatedAt")
SELECT "action", "auditId", "createdAt", "id", "newValue", "oldValue", "userId", "createdAt" FROM "InventoryAuditHistory";
DROP TABLE "InventoryAuditHistory";
ALTER TABLE "new_InventoryAuditHistory" RENAME TO "InventoryAuditHistory";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
