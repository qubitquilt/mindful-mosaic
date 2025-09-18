-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_routines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "timeSlot" TEXT,
    "scheduledDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "routines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_routines" ("createdAt", "id", "name", "timeSlot", "updatedAt", "userId") SELECT "createdAt", "id", "name", "timeSlot", "updatedAt", "userId" FROM "routines";
DROP TABLE "routines";
ALTER TABLE "new_routines" RENAME TO "routines";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
