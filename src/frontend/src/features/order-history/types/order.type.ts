import { OrderClientController_getMyOrders_Params, OrderClientController_getMyOrders_Response, OrderClientController_getOrderByCode_Response, } from "@/lib/open-api-client/type.client";

// Endpoint: /shop/v1/client/orders/my-orders
// type OrderGetMyOrdersParams = {
//     cursor?: string | undefined;
//     limit?: string | undefined;
//     sortOrder?: "asc" | "desc" | undefined;
//     customerId?: string | undefined;
//     status?: "PENDING_PAYMENT" | "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELED" | "RETURNED" | undefined;
//     startDate?: string | undefined;
//     endDate?: string | undefined;
//     search?: string | undefined;
// }
export type OrderGetMyOrdersParams = OrderClientController_getMyOrders_Params


//type OrderGetMyOrdersResponse = {
//     items: {
//         orderId: string;
//         userId: string;
//         orderCode: string;
//         totalPrice: number;
//         status: "PENDING_PAYMENT" | "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELED" | "RETURNED";
//         recipientName: string;
//         phoneNumber: string;
//         shippingAddress: string;
//         email: string | null;
//         createdAt: string;
//         updatedAt: string;
//         orderDetails?: {
//             orderDetailId: string;
//             orderId: string;
//             variantId: string;
//             quantity: number;
//             pricePerUnit: number;
//             createdAt: string;
//             updatedAt: string;
//         }[] | undefined;
//     }[];
//     nextCursor: string | null;
// }
export type OrderGetMyOrdersResponse = OrderClientController_getMyOrders_Response['data']


// Endpoint: /shop/v1/client/orders/code/{orderCode}
// Not Equal to OrderGetMyOrdersResponse['items'][number]
// type DetailOrder = {
//     orderId: string;
//     userId: string;
//     orderCode: string;
//     totalPrice: number;
//     status: "PENDING_PAYMENT" | "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELED" | "RETURNED";
//     recipientName: string;
//     phoneNumber: string;
//     shippingAddress: string;
//     email: string | null;
//     createdAt: string;
//     updatedAt: string;
//     orderDetails: {
//         orderDetailId: string;
//         orderId: string;
//         variantId: string;
//         quantity: number;
//         pricePerUnit: number;
//         createdAt: string;
//         updatedAt: string;
//         variant: {
//             sku: string;
//             size: string;
//             name: string;
//             color: string;
//             thumbnail: string;
//             optionId: string;
//         };
//     }[];
// }

export type DetailOrder = OrderClientController_getOrderByCode_Response['data']
export type Order = DetailOrder;

export const ORDER_STATUS_COLORS = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPING: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELED: "bg-red-100 text-red-800 border-red-200",
  RETURNED: "bg-gray-100 text-gray-800 border-gray-200",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_COLORS;