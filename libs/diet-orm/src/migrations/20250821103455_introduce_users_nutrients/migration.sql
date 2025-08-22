/*
  Warnings:

  - You are about to drop the column `energyDisplayUnit` on the `food_variations` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `food_variations` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `nutrients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,food_id]` on the table `food_variations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `food_id` to the `food_variations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "food_variations" DROP CONSTRAINT "food_variations_foodId_fkey";

-- DropForeignKey
ALTER TABLE "nutrients" DROP CONSTRAINT "nutrients_userId_fkey";

-- DropIndex
DROP INDEX "food_variations_name_foodId_key";

-- AlterTable
ALTER TABLE "food_variations" DROP COLUMN "energyDisplayUnit",
DROP COLUMN "foodId",
ADD COLUMN     "energy_display_unit" "Energy" NOT NULL DEFAULT 'kcal',
ADD COLUMN     "food_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "nutrients" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "users_nutrients" (
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nutrient_id" TEXT NOT NULL,

    CONSTRAINT "users_nutrients_pkey" PRIMARY KEY ("user_id","nutrient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "food_variations_name_food_id_key" ON "food_variations"("name", "food_id");

-- AddForeignKey
ALTER TABLE "users_nutrients" ADD CONSTRAINT "users_nutrients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_nutrients" ADD CONSTRAINT "users_nutrients_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "food_variations" ADD CONSTRAINT "food_variations_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
