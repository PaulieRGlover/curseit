-- CreateTable
CREATE TABLE "KitchenProject" (
    "id" TEXT NOT NULL,
    "date_added" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spend_portions" BOOLEAN NOT NULL DEFAULT true,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "KitchenProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortionInKitchenProject" (
    "id" TEXT NOT NULL,
    "size_in_grams" DOUBLE PRECISION NOT NULL,
    "size_display_unit" "FoodUnit" NOT NULL DEFAULT 'g',
    "food_portion_id" TEXT NOT NULL,
    "kitchen_project_id" TEXT NOT NULL,

    CONSTRAINT "PortionInKitchenProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KitchenProject" ADD CONSTRAINT "KitchenProject_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortionInKitchenProject" ADD CONSTRAINT "PortionInKitchenProject_food_portion_id_fkey" FOREIGN KEY ("food_portion_id") REFERENCES "food_portions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortionInKitchenProject" ADD CONSTRAINT "PortionInKitchenProject_kitchen_project_id_fkey" FOREIGN KEY ("kitchen_project_id") REFERENCES "KitchenProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
