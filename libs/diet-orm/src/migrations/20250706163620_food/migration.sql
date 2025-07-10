/*
  Warnings:

  - You are about to drop the `cache_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cached_foods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrients_in_food` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `favorite` to the `foods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cached_foods" DROP CONSTRAINT "cached_foods_cache_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "cached_foods" DROP CONSTRAINT "cached_foods_food_id_fkey";

-- DropForeignKey
ALTER TABLE "nutrients_in_food" DROP CONSTRAINT "nutrients_in_food_food_id_fkey";

-- DropForeignKey
ALTER TABLE "nutrients_in_food" DROP CONSTRAINT "nutrients_in_food_nutrient_id_fkey";

-- AlterTable
ALTER TABLE "foods" ADD COLUMN     "counter" TEXT NOT NULL DEFAULT '🥫',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "favorite" BOOLEAN NOT NULL,
ADD COLUMN     "perishable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "picture" TEXT,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "cache_entries";

-- DropTable
DROP TABLE "cached_foods";

-- DropTable
DROP TABLE "nutrients_in_food";

-- CreateTable
CREATE TABLE "food_variations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reference_size_in_grams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "reference_size_display_unit" TEXT NOT NULL DEFAULT 'g',
    "portion_size_in_grams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "portion_size_display_unit" TEXT NOT NULL DEFAULT 'g',
    "energy_auto" BOOLEAN NOT NULL DEFAULT true,
    "foodId" TEXT NOT NULL,

    CONSTRAINT "food_variations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients_in_food_variations" (
    "value_in_grams" DOUBLE PRECISION NOT NULL,
    "value_display_unit" TEXT NOT NULL DEFAULT 'g',
    "food_variation_id" TEXT NOT NULL,
    "nutrient_id" TEXT NOT NULL,

    CONSTRAINT "nutrients_in_food_variations_pkey" PRIMARY KEY ("food_variation_id","nutrient_id")
);

-- CreateTable
CREATE TABLE "food_portions" (
    "id" TEXT NOT NULL,
    "time_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_expiring" TIMESTAMP(3) NOT NULL,
    "size_in_grams" DOUBLE PRECISION NOT NULL,
    "size_display_unit" TEXT NOT NULL,
    "food_variation_id" TEXT NOT NULL,

    CONSTRAINT "food_portions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "food_variations_name_key" ON "food_variations"("name");

-- AddForeignKey
ALTER TABLE "foods" ADD CONSTRAINT "foods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_variations" ADD CONSTRAINT "food_variations_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrients_in_food_variations" ADD CONSTRAINT "nutrients_in_food_variations_food_variation_id_fkey" FOREIGN KEY ("food_variation_id") REFERENCES "food_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrients_in_food_variations" ADD CONSTRAINT "nutrients_in_food_variations_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_portions" ADD CONSTRAINT "food_portions_food_variation_id_fkey" FOREIGN KEY ("food_variation_id") REFERENCES "food_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
