-- CreateTable
CREATE TABLE "nutritients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "norm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "nutritients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutritients_in_food" (
    "value" DOUBLE PRECISION NOT NULL,
    "foodId" TEXT NOT NULL,
    "nutritientId" TEXT NOT NULL,

    CONSTRAINT "nutritients_in_food_pkey" PRIMARY KEY ("foodId","nutritientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "nutritients_name_key" ON "nutritients"("name");

-- AddForeignKey
ALTER TABLE "nutritients_in_food" ADD CONSTRAINT "nutritients_in_food_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutritients_in_food" ADD CONSTRAINT "nutritients_in_food_nutritientId_fkey" FOREIGN KEY ("nutritientId") REFERENCES "nutritients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
