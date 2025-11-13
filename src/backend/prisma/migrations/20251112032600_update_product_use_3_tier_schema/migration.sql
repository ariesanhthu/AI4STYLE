/*
  Warnings:

  - You are about to drop the column `product_id` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `color_family` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_show` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[option_id,size]` on the table `product_variants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `option_id` to the `product_variants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_category_id_fkey";

-- DropIndex
DROP INDEX "public"."products_slug_key";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "product_id",
ADD COLUMN     "option_id" TEXT NOT NULL,
ALTER COLUMN "stock_quantity" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "color",
DROP COLUMN "color_family",
DROP COLUMN "images",
DROP COLUMN "is_show",
DROP COLUMN "slug",
DROP COLUMN "thumbnail";

-- CreateTable
CREATE TABLE "product_options" (
    "option_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "color_family" TEXT NOT NULL,
    "images" TEXT[],
    "price" INTEGER NOT NULL,
    "new_price" INTEGER,
    "out_of_stock" BOOLEAN NOT NULL DEFAULT false,
    "is_show" BOOLEAN NOT NULL DEFAULT true,
    "search" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("option_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_options_name_key" ON "product_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "product_options_slug_key" ON "product_options"("slug");

-- CreateIndex
CREATE INDEX "product_options_product_id_idx" ON "product_options"("product_id");

-- CreateIndex
CREATE INDEX "product_options_slug_idx" ON "product_options"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "product_variants_option_id_idx" ON "product_variants"("option_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_option_id_size_key" ON "product_variants"("option_id", "size");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_options" ADD CONSTRAINT "product_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "product_options"("option_id") ON DELETE CASCADE ON UPDATE CASCADE;
