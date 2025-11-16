-- DropForeignKey
ALTER TABLE "food_variations" DROP CONSTRAINT "food_variations_food_id_fkey";

-- AlterTable
ALTER TABLE "nutrients_in_food_variations" ADD COLUMN     "added_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "food_variations" ADD CONSTRAINT "food_variations_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
