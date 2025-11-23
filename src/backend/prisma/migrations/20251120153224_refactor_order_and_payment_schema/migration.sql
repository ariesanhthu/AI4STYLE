/*
  Warnings:

  - You are about to drop the column `price` on the `order_details` table. All the data in the column will be lost.
  - The `status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `method_name` on the `payment_methods` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_code]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price_per_unit` to the `order_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_code` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipient_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping_address` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_name` to the `payment_methods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `payment_methods` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EOrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'CANCELED', 'RETURNED');

-- CreateEnum
CREATE TYPE "EPaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ETransactionType" AS ENUM ('INITIATED', 'CAPTURED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EPaymentMehod" AS ENUM ('CASH_ON_DELIVERY', 'MOMO');

-- AlterTable
ALTER TABLE "order_details" DROP COLUMN "price",
ADD COLUMN     "price_per_unit" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "email" TEXT,
ADD COLUMN     "order_code" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "recipient_name" TEXT NOT NULL,
ADD COLUMN     "shipping_address" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EOrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "method_name",
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "type" "EPaymentMehod" NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "status",
ADD COLUMN     "status" "EPaymentStatus" NOT NULL;

-- CreateTable
CREATE TABLE "payment_transactions" (
    "transaction_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "request_body" TEXT NOT NULL,
    "response_body" TEXT NOT NULL,
    "type" "ETransactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE INDEX "payment_transactions_payment_id_idx" ON "payment_transactions"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE CASCADE ON UPDATE CASCADE;
