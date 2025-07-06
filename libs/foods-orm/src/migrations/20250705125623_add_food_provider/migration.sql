/*
  Warnings:

  - A unique constraint covering the columns `[name,provider]` on the table `foods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "foods_name_key";

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "foods_name_provider_key" ON "foods"("name", "provider");
