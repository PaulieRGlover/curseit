-- AlterTable
ALTER TABLE "nutrients" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "nutrients" ADD CONSTRAINT "nutrients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
