/*
  Warnings:

  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.
  - Added the required column `satus` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('PENDING', 'ACTIVE', 'FAILED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isActive",
ADD COLUMN     "satus" "ProductStatus" NOT NULL;
