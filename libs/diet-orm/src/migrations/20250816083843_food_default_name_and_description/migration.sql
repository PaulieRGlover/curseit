/*
  Warnings:

  - Made the column `description` on table `foods` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "foods" ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '';
