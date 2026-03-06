/*
  Warnings:

  - You are about to drop the `portions_in_recipe_projects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "portions_in_recipe_projects" DROP CONSTRAINT "portions_in_recipe_projects_food_portion_id_fkey";

-- DropForeignKey
ALTER TABLE "portions_in_recipe_projects" DROP CONSTRAINT "portions_in_recipe_projects_recipe_project_id_fkey";

-- DropTable
DROP TABLE "portions_in_recipe_projects";

-- CreateTable
CREATE TABLE "recipe_project_ingredients" (
    "id" TEXT NOT NULL,
    "size_in_grams" DOUBLE PRECISION NOT NULL,
    "size_display_unit" "FoodUnit" NOT NULL DEFAULT 'g',
    "food_portion_id" TEXT NOT NULL,
    "recipe_project_id" TEXT NOT NULL,

    CONSTRAINT "recipe_project_ingredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_project_ingredients" ADD CONSTRAINT "recipe_project_ingredients_food_portion_id_fkey" FOREIGN KEY ("food_portion_id") REFERENCES "food_portions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_project_ingredients" ADD CONSTRAINT "recipe_project_ingredients_recipe_project_id_fkey" FOREIGN KEY ("recipe_project_id") REFERENCES "recipe_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
