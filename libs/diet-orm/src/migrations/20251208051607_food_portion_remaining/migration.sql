/*
  Warnings:

  - Added the required column `remaining_in_grams` to the `food_portions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "food_portions" ADD COLUMN     "remaining_display_unit" "FoodUnit" NOT NULL DEFAULT 'g',
ADD COLUMN     "remaining_in_grams" DOUBLE PRECISION NOT NULL;
