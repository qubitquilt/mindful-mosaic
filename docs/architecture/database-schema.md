# **Database Schema**

This is the definitive schema.prisma file that will be located in the packages/db/prisma directory. It defines all tables, fields, and relations for the application.

// packages/db/prisma/schema.prisma

datasource db {

  provider = "sqlite"

  url      = "file:./dev.db"

}

generator client {

  provider = "prisma-client-js"

}

model Account {

  id                String  @id @default(cuid())

  userId            String

  type              String

  provider          String

  providerAccountId String

  refresh\_token     String?

  access\_token      String?

  expires\_at        Int?

  token\_type        String?

  scope             String?

  id\_token          String?

  user User @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@unique(\[provider, providerAccountId\])

}

model User {

  id        String    @id @default(cuid())

  name      String?

  email     String    @unique

  image     String?

  accounts  Account\[\]

  routines  Routine\[\]

}

model Routine {

  id            String   @id @default(cuid())

  name          String

  scheduledTime String

  repeatDays    String   // Stored as a comma-separated string e.g., "MONDAY,TUESDAY"

  userId        String

  user          User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  tasks         Task\[\]

}

model Task {

  id        String  @id @default(cuid())

  name      String

  duration  Int     // Duration in minutes

  order     Int

  routineId String

  routine   Routine @relation(fields: \[routineId\], references: \[id\], onDelete: Cascade)

}
