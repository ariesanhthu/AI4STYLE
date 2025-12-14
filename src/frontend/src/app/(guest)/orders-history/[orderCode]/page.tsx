import { OrderHistoryDetail } from "@/features/order-history";

interface OrderDetailPageProps {
  params: Promise<{ orderCode: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderCode } = await params;
  return (
    <OrderHistoryDetail orderCode={orderCode} />
  );
}
