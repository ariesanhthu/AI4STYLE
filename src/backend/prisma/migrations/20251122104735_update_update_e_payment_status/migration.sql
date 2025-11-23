/*
  Warnings:

  - The values [COMPLETED] on the enum `EPaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `amount` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EPaymentStatus_new" AS ENUM ('PENDING', 'CAPTURED', 'FAILED', 'REFUNDED', 'CANCELED');
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "EPaymentStatus_new" USING ("status"::text::"EPaymentStatus_new");
ALTER TYPE "EPaymentStatus" RENAME TO "EPaymentStatus_old";
ALTER TYPE "EPaymentStatus_new" RENAME TO "EPaymentStatus";
DROP TYPE "public"."EPaymentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "amount" INTEGER NOT NULL;
