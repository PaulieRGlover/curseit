/*
  Warnings:

  - You are about to drop the column `value` on the `nutrients_in_food` table. All the data in the column will be lost.
  - Made the column `value_in_grams` on table `nutrients_in_food` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "nutrients_in_food" DROP COLUMN "value",
ALTER COLUMN "value_in_grams" SET NOT NULL;
