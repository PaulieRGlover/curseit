/*
  Warnings:

  - A unique constraint covering the columns `[name,foodId]` on the table `food_variations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "food_variations_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "food_variations_name_foodId_key" ON "food_variations"("name", "foodId");
