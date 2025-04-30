-- CreateTable
CREATE TABLE "invalidated_tokens" (
    "id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invalidated_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "invalidated_tokens_expires_at_idx" ON "invalidated_tokens"("expires_at");
