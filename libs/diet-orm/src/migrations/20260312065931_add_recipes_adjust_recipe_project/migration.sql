/*
  Warnings:

  - Added the required column `food_id` to the `recipe_project_ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe_project_ingredients" ADD COLUMN     "food_id" TEXT NOT NULL,
ADD COLUMN     "food_variation_id" TEXT,
ALTER COLUMN "food_portion_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recipe_projects" ADD COLUMN     "description" TEXT,
ADD COLUMN     "recipe_id" TEXT,
ADD COLUMN     "time_to_cook" INTEGER,
ADD COLUMN     "time_until_spoiled" INTEGER,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "time_to_cook" INTEGER,
    "time_to_spoil" INTEGER,
    "description" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipe_ingredients" (
    "id" TEXT NOT NULL,
    "size_in_grams" DOUBLE PRECISION NOT NULL,
    "size_display_unit" "FoodUnit" NOT NULL DEFAULT 'g',
    "food_id" TEXT NOT NULL,
    "food_variation_id" TEXT,
    "recipe_project_id" TEXT NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_projects" ADD CONSTRAINT "recipe_projects_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_project_ingredients" ADD CONSTRAINT "recipe_project_ingredients_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_project_ingredients" ADD CONSTRAINT "recipe_project_ingredients_food_variation_id_fkey" FOREIGN KEY ("food_variation_id") REFERENCES "food_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_food_variation_id_fkey" FOREIGN KEY ("food_variation_id") REFERENCES "food_variations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_project_id_fkey" FOREIGN KEY ("recipe_project_id") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
