/*
  Warnings:

  - You are about to drop the `KitchenProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortionInKitchenProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KitchenProject" DROP CONSTRAINT "KitchenProject_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PortionInKitchenProject" DROP CONSTRAINT "PortionInKitchenProject_food_portion_id_fkey";

-- DropForeignKey
ALTER TABLE "PortionInKitchenProject" DROP CONSTRAINT "PortionInKitchenProject_kitchen_project_id_fkey";

-- DropTable
DROP TABLE "KitchenProject";

-- DropTable
DROP TABLE "PortionInKitchenProject";

-- CreateTable
CREATE TABLE "recipe_projects" (
    "id" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spend_portions" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "recipe_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portions_in_recipe_projects" (
    "id" TEXT NOT NULL,
    "size_in_grams" DOUBLE PRECISION NOT NULL,
    "size_display_unit" "FoodUnit" NOT NULL DEFAULT 'g',
    "food_portion_id" TEXT NOT NULL,
    "recipe_project_id" TEXT NOT NULL,

    CONSTRAINT "portions_in_recipe_projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_projects" ADD CONSTRAINT "recipe_projects_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portions_in_recipe_projects" ADD CONSTRAINT "portions_in_recipe_projects_food_portion_id_fkey" FOREIGN KEY ("food_portion_id") REFERENCES "food_portions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portions_in_recipe_projects" ADD CONSTRAINT "portions_in_recipe_projects_recipe_project_id_fkey" FOREIGN KEY ("recipe_project_id") REFERENCES "recipe_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
