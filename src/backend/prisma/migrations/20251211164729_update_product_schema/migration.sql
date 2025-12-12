/*
  Warnings:

  - Made the column `new_price` on table `product_options` required. This step will fail if there are existing NULL values in that column.
  - Made the column `new_price` on table `product_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_options" ALTER COLUMN "new_price" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" ALTER COLUMN "new_price" SET NOT NULL;
