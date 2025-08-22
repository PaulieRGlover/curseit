/*
  Warnings:

  - The primary key for the `nutrients_in_food_variations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `nutrients_in_food_variations` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "nutrients_in_food_variations" DROP CONSTRAINT "nutrients_in_food_variations_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "nutrients_in_food_variations_pkey" PRIMARY KEY ("id");
