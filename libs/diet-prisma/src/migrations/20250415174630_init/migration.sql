-- CreateTable
CREATE TABLE "foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "nutrients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrients_in_food" (
    "value" DOUBLE PRECISION,
    "food_id" TEXT NOT NULL,
    "nutrient_id" TEXT NOT NULL,

    CONSTRAINT "nutrients_in_food_pkey" PRIMARY KEY ("food_id","nutrient_id")
);

-- CreateTable
CREATE TABLE "cache_entries" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cache_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cached_foods" (
    "food_id" TEXT NOT NULL,
    "cache_entry_id" TEXT NOT NULL,

    CONSTRAINT "cached_foods_pkey" PRIMARY KEY ("food_id","cache_entry_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "foods_name_key" ON "foods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "nutrients_name_key" ON "nutrients"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cache_entries_hash_key" ON "cache_entries"("hash");

-- AddForeignKey
ALTER TABLE "nutrients_in_food" ADD CONSTRAINT "nutrients_in_food_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrients_in_food" ADD CONSTRAINT "nutrients_in_food_nutrient_id_fkey" FOREIGN KEY ("nutrient_id") REFERENCES "nutrients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_foods" ADD CONSTRAINT "cached_foods_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cached_foods" ADD CONSTRAINT "cached_foods_cache_entry_id_fkey" FOREIGN KEY ("cache_entry_id") REFERENCES "cache_entries"("hash") ON DELETE CASCADE ON UPDATE CASCADE;
