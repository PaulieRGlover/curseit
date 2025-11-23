-- AlterTable
ALTER TABLE "food_portions" RENAME COLUMN "time_added" TO "date_added";
ALTER TABLE "food_portions" RENAME COLUMN "time_expiring" TO "date_expiring";

-- AlterTable
ALTER TABLE "nutrients_in_food_variations" RENAME COLUMN "added_date" TO "date_added";
