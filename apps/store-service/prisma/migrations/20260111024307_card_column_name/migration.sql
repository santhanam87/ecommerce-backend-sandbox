/*
  Warnings:

  - You are about to drop the column `name` on the `CreditCard` table. All the data in the column will be lost.
  - Added the required column `cardHoldername` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "name",
ADD COLUMN     "cardHoldername" TEXT NOT NULL,
ALTER COLUMN "cardNumber" SET DATA TYPE TEXT,
ALTER COLUMN "cvv" SET DATA TYPE TEXT;
