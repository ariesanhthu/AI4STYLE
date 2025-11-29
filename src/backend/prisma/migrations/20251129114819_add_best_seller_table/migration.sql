-- CreateTable
CREATE TABLE "best_sellers" (
    "product_option_id" TEXT NOT NULL,
    "total_sold" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "best_sellers_pkey" PRIMARY KEY ("product_option_id")
);

-- CreateIndex
CREATE INDEX "best_sellers_total_sold_idx" ON "best_sellers"("total_sold");

-- AddForeignKey
ALTER TABLE "best_sellers" ADD CONSTRAINT "best_sellers_product_option_id_fkey" FOREIGN KEY ("product_option_id") REFERENCES "product_options"("option_id") ON DELETE CASCADE ON UPDATE CASCADE;
