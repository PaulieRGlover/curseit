/*
  Warnings:

  - The `size_display_unit` column on the `food_portions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `reference_size_display_unit` column on the `food_variations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `portion_size_display_unit` column on the `food_variations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `energyDisplayUnit` column on the `food_variations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `value_display_unit` column on the `nutrients_in_food_variations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('µg', 'mg', 'g', 'kg', 'oz', 'lb');

-- CreateEnum
CREATE TYPE "Energy" AS ENUM ('kJ', 'kcal');

-- AlterTable
ALTER TABLE "food_portions" DROP COLUMN "size_display_unit",
ADD COLUMN     "size_display_unit" "Unit" NOT NULL DEFAULT 'g';

-- AlterTable
ALTER TABLE "food_variations" DROP COLUMN "reference_size_display_unit",
ADD COLUMN     "reference_size_display_unit" "Unit" NOT NULL DEFAULT 'g',
DROP COLUMN "portion_size_display_unit",
ADD COLUMN     "portion_size_display_unit" "Unit" NOT NULL DEFAULT 'g',
DROP COLUMN "energyDisplayUnit",
ADD COLUMN     "energyDisplayUnit" "Energy" NOT NULL DEFAULT 'kcal';

-- AlterTable
ALTER TABLE "nutrients_in_food_variations" DROP COLUMN "value_display_unit",
ADD COLUMN     "value_display_unit" "Unit" NOT NULL DEFAULT 'g';
