/*
  Warnings:

  - You are about to drop the column `energy_amount` on the `food_variations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "food_variations" DROP COLUMN "energy_amount",
ADD COLUMN     "energy_amount_in_kcal" DOUBLE PRECISION;
