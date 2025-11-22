import { PaymentMethodEntity } from "../../payment-method/entities";
import { EPaymentMethod } from "../../payment-method/enums";
import { CreatePaymentDto, CreatePaymentResponseDto } from "../dtos";
import { PaymentEntity } from "../entities";
import { GeneralIpn } from "./general-ipn.interface";

export interface IProvider {
  type: EPaymentMethod;
  create(data: CreatePaymentDto, paymentMethod: PaymentMethodEntity, amount: number): Promise<CreatePaymentResponseDto>;
  capture?(payment: PaymentEntity): Promise<PaymentEntity>;
  refund?(payment: PaymentEntity): Promise<PaymentEntity>;
  cancel?(payment: PaymentEntity): Promise<PaymentEntity>;
}

export interface IProviderGateway extends IProvider {
  getPaymentUrl?(data: CreatePaymentDto): Promise<string>;
  handleIPN(ipnData: GeneralIpn): Promise<{ response: any ,payment: PaymentEntity | undefined}>;
}