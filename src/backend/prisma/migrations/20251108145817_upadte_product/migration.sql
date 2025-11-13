/*
  Warnings:

  - You are about to drop the column `new_price` on the `product_options` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product_options` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `product_options` table. All the data in the column will be lost.
  - Added the required column `color_family` to the `product_options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_options" DROP COLUMN "new_price",
DROP COLUMN "price",
DROP COLUMN "size",
ADD COLUMN     "color_family" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "is_show" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "new_price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "product_size_options" (
    "variant_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "new_price" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_size_options_pkey" PRIMARY KEY ("variant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_size_options_sku_key" ON "product_size_options"("sku");

-- AddForeignKey
ALTER TABLE "product_size_options" ADD CONSTRAINT "product_size_options_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_options"("option_id") ON DELETE RESTRICT ON UPDATE CASCADE;
