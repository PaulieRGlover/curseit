/*
  Warnings:

  - You are about to drop the column `counter` on the `foods` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_variations" ADD COLUMN     "counter" TEXT NOT NULL DEFAULT '🥫';

-- AlterTable
ALTER TABLE "foods" DROP COLUMN "counter";
