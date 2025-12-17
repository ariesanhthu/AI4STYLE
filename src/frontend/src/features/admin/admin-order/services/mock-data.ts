import { Order } from "../types";

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    code: "ORD-2023-001",
    totalPrice: 1500000,
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ord_002",
    code: "ORD-2023-002",
    totalPrice: 2500000,
    status: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ord_003",
    code: "ORD-2023-003",
    totalPrice: 750000,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "ord_004",
    code: "ORD-2023-004",
    totalPrice: 5000000,
    status: "SHIPPED",
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "ord_005",
    code: "ORD-2023-005",
    totalPrice: 1200000,
    status: "PENDING",
    paymentStatus: "UNPAID",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "ord_006",
    code: "ORD-2023-006",
    totalPrice: 3000000,
    status: "COMPLETED",
    paymentStatus: "PAID",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  }
];
