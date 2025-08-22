-- AlterTable
ALTER TABLE "food_variations" ADD COLUMN     "energyDisplayUnit" TEXT NOT NULL DEFAULT 'kcal',
ADD COLUMN     "energy_amount" DOUBLE PRECISION;
