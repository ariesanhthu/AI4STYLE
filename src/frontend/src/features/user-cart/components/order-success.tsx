"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-6">
      <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/30">
        <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground text-lg max-w-[500px]">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và sẽ sớm được xử lý.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/">
            Về trang chủ
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/orders-history">
            Xem lịch sử đơn hàng
          </Link>
        </Button>
      </div>
    </div>
  );
}
