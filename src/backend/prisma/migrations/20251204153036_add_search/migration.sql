-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "search" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "search" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "product_options" ALTER COLUMN "search" SET DEFAULT '';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "search" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "search" TEXT NOT NULL DEFAULT '';
