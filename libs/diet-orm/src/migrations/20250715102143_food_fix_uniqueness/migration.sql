/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `foods` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "foods_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "foods_name_user_id_key" ON "foods"("name", "user_id");
