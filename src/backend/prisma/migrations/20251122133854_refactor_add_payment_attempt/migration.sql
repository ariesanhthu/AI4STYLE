/*
  Warnings:

  - You are about to drop the column `payment_id` on the `payment_transactions` table. All the data in the column will be lost.
  - Added the required column `payment_attempt_id` to the `payment_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."payment_transactions" DROP CONSTRAINT "payment_transactions_payment_id_fkey";

-- DropIndex
DROP INDEX "public"."payment_transactions_payment_id_idx";

-- AlterTable
ALTER TABLE "payment_transactions" DROP COLUMN "payment_id",
ADD COLUMN     "payment_attempt_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "payment_attempts" (
    "payment_attempt_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "payment_method_id" TEXT NOT NULL,
    "type" "EPaymentMehod" NOT NULL,
    "order_number" INTEGER NOT NULL,
    "status" "EPaymentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_attempts_pkey" PRIMARY KEY ("payment_attempt_id")
);

-- CreateIndex
CREATE INDEX "payment_transactions_payment_attempt_id_idx" ON "payment_transactions"("payment_attempt_id");

-- AddForeignKey
ALTER TABLE "payment_attempts" ADD CONSTRAINT "payment_attempts_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_attempt_id_fkey" FOREIGN KEY ("payment_attempt_id") REFERENCES "payment_attempts"("payment_attempt_id") ON DELETE SET NULL ON UPDATE CASCADE;
