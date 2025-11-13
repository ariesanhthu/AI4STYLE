/*
  Warnings:

  - You are about to drop the column `new_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `product_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_size_options` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_family` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."product_options" DROP CONSTRAINT "product_options_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_size_options" DROP CONSTRAINT "product_size_options_option_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "new_price",
DROP COLUMN "price",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "color_family" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "slug" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."product_options";

-- DropTable
DROP TABLE "public"."product_size_options";

-- CreateTable
CREATE TABLE "product_variants" (
    "variant_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "new_price" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("variant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
