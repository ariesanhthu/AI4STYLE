import type {
  PaymentMethodClientController_getAllPaymentMethods_Params,
  PaymentMethodClientController_getAllPaymentMethods_Request,
  PaymentMethodClientController_getAllPaymentMethods_Response,
  PaymentClientController_createPayment_Params,
  PaymentClientController_createPayment_Request,
  PaymentClientController_createPayment_Response,
} from "@/lib/open-api-client/type.client";

export type PaymentMethodParams =
  PaymentMethodClientController_getAllPaymentMethods_Params;
export type PaymentMethodRequest =
  PaymentMethodClientController_getAllPaymentMethods_Request;
export type PaymentMethodResponse =
  PaymentMethodClientController_getAllPaymentMethods_Response;

export type CreatePaymentParams = PaymentClientController_createPayment_Params;
export type CreatePaymentRequest =
  PaymentClientController_createPayment_Request;
export type CreatePaymentResponse =
  PaymentClientController_createPayment_Response;
