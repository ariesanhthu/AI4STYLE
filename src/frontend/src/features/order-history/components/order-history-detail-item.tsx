import Image from "next/image";
import { DetailOrder } from "../types/order.type";
import Link from "next/link";

type OrderDetailItemType = DetailOrder["orderDetails"][number];

interface OrderHistoryDetailItemProps {
  item: OrderDetailItemType;
}

export function OrderHistoryDetailItem({ item }: OrderHistoryDetailItemProps) {
  const { variant, quantity, pricePerUnit } = item;

  return (
    <Link
      className="flex gap-4 py-4 border-b last:border-0"
      href={`/products/${variant.slug}?id=${variant.optionId}`}
    >
      {/* Thumbnail */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
        {variant.thumbnail ? (
          <Image
            src={variant.thumbnail}
            alt={variant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium">{variant.name}</h3>
          <div className="mt-1 flex text-sm text-muted-foreground gap-2">
            <span>Size: {variant.size}</span>
            <span>•</span>
            <span>Màu: {variant.color}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-sm">
            Số lượng: <span className="font-medium">{quantity}</span>
          </div>
          <div className="font-medium text-primary">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(pricePerUnit * quantity)}
          </div>
        </div>
      </div>
    </Link>
  );
}
