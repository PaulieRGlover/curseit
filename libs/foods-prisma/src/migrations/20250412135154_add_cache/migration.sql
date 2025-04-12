/*
  Warnings:

  - The primary key for the `nutritients_in_food` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `foodId` on the `nutritients_in_food` table. All the data in the column will be lost.
  - You are about to drop the column `nutritientId` on the `nutritients_in_food` table. All the data in the column will be lost.
  - Added the required column `food_id` to the `nutritients_in_food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutritient_id` to the `nutritients_in_food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "nutritients_in_food" DROP CONSTRAINT "nutritients_in_food_foodId_fkey";

-- DropForeignKey
ALTER TABLE "nutritients_in_food" DROP CONSTRAINT "nutritients_in_food_nutritientId_fkey";

-- AlterTable
ALTER TABLE "nutritients_in_food" DROP CONSTRAINT "nutritients_in_food_pkey",
DROP COLUMN "foodId",
DROP COLUMN "nutritientId",
ADD COLUMN     "food_id" TEXT NOT NULL,
ADD COLUMN     "nutritient_id" TEXT NOT NULL,
ADD CONSTRAINT "nutritients_in_food_pkey" PRIMARY KEY ("food_id", "nutritient_id");

-- CreateTable
CREATE TABLE "cache_entries" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cache_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_foods" (
    "food_id" TEXT NOT NULL,
    "cache_entry_id" TEXT NOT NULL,

    CONSTRAINT "cached_foods_pkey" PRIMARY KEY ("food_id","cache_entry_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cache_entries_hash_key" ON "cache_entries"("hash");

-- AddForeignKey
ALTER TABLE "nutritients_in_food" ADD CONSTRAINT "nutritients_in_food_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritients_in_food" ADD CONSTRAINT "nutritients_in_food_nutritient_id_fkey" FOREIGN KEY ("nutritient_id") REFERENCES "nutritients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_foods" ADD CONSTRAINT "cached_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_foods" ADD CONSTRAINT "cached_foods_cache_entry_id_fkey" FOREIGN KEY ("cache_entry_id") REFERENCES "cache_entries"("hash") ON DELETE CASCADE ON UPDATE CASCADE;
