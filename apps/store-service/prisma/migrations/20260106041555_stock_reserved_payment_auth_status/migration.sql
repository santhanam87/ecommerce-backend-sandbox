-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isPaymentAuthorized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isStockReserved" BOOLEAN NOT NULL DEFAULT false;
