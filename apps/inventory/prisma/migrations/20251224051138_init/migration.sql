-- CreateTable
CREATE TABLE "Inventroy" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "availableQty" INTEGER NOT NULL,
    "reservedQty" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventroy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventroy_productId_key" ON "Inventroy"("productId");
