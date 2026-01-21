-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('AUTHORIZED', 'AWAITING_PAYMENT', 'PAYMENT_PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authorizationId" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'AUTHORIZED',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
