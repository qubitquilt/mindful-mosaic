/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `routines` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_routines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "scheduledTime" TEXT,
    "repeatDays" TEXT,
    "scheduledDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "routines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_routines" ("createdAt", "id", "name", "scheduledDate", "updatedAt", "userId") SELECT "createdAt", "id", "name", "scheduledDate", "updatedAt", "userId" FROM "routines";
DROP TABLE "routines";
ALTER TABLE "new_routines" RENAME TO "routines";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
