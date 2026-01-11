/*
  Warnings:

  - You are about to drop the column `cardHoldername` on the `CreditCard` table. All the data in the column will be lost.
  - Added the required column `cardHolderName` to the `CreditCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "cardHoldername",
ADD COLUMN     "cardHolderName" TEXT NOT NULL;
