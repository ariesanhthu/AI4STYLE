import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { GeneralIpn, IProvider, IProviderGateway, MomoConfirmRequest, MomoConfirmResponse, MomoCreateResponse } from "../../interfaces";
import { CreatePaymentDto, CreatePaymentResponseDto } from "../../dtos";
import { PaymentEntity, PaymentTransactionEntity } from "../../entities";
import { EPaymentMethod } from "../../../payment-method/enums";
import { PaymentMethodEntity } from "../../../payment-method/entities";
import { randomUUID } from "crypto";
import { hashSHA256 } from "../../../shared/helpers/hash.helper";
import { HttpService } from "@nestjs/axios/dist/http.service";
import { type IPaymentRepository } from "../../repositories";
import { firstValueFrom } from "rxjs";
import { EMomoConfirmType, EPaymentStatus, ETransactionType } from "../../enums";

@Injectable()
export class MomoService implements IProviderGateway {
  constructor(
    private readonly httpService: HttpService,
    @Inject('PaymentRepository')
    private readonly paymentRepository: IPaymentRepository,
  ) { }
  private readonly logger = new Logger(MomoService.name);
  type = EPaymentMethod.MOMO;

  async create(data: CreatePaymentDto, paymentMethod: PaymentMethodEntity, amount: number): Promise<CreatePaymentResponseDto> {
    try {
      // Kiểm tra cấu hình MoMo
      const accessKey =  process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.MOMO_PARTNER_CODE;
      const momoUrl = process.env.NODE_ENV === 'production' ? process.env.MOMO_URL : process.env.MOMO_URL_TEST;

      console.log('Momo Config:', { accessKey, secretKey, partnerCode, momoUrl });

      if (!accessKey || !secretKey || !partnerCode || !momoUrl) {
        throw new BadRequestException('Momo payment: Missing configuration for MoMo payment gateway!');
      }

      const redirectUrl = 'www.example.com/return'; // TODO: Thay đổi URL redirect sau khi thanh toán thành công
      const ipnUrl = process.env.MOMO_IPN_URL;
      const partnerName = process.env.MOMO_PARTNER_NAME || "MoMo Payment";
      const storeId = process.env.MOMO_STORE_ID || "";
      const storeName = process.env.MOMO_STORE_NAME || "";

      if (!ipnUrl || !momoUrl) {
        throw new BadRequestException('Momo payment: IPN URL or MoMo URL not configured!');
      }

      const requestId = randomUUID();
      const orderInfo = 'pay with MoMo';
      const requestType = 'payWithMethod';
      const orderMomoId = this.generateMomoOrderId(data.orderId);
      const extraData = '';
      const lang = 'vi';

      // Tạo signature để xác thực request với MoMo
      const rawSignature =
        `accessKey=${accessKey}` +
        `&amount=${amount}` +
        `&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}` +
        `&orderId=${orderMomoId}` +
        `&orderInfo=${orderInfo}` +
        `&partnerCode=${partnerCode}` +
        `&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}` +
        `&requestType=${requestType}`;
        
      const signature = hashSHA256(rawSignature, secretKey);
      const requestBody = {
        partnerCode,
        partnerName,
        storeId,
        storeName,
        requestId,
        amount: amount,
        orderId: orderMomoId,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        orderInfo,
        extraData,
        signature,
        autoCapture: false,
      };

      this.logger.debug('Momo Request Body:', requestBody);

      // Gửi request đến MoMo API để tạo thanh toán
      const result = await firstValueFrom(
        this.httpService.post(
          `${momoUrl}/create`,
          requestBody,
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      if (result.data.resultCode !== 0) {
        throw new BadRequestException(`[Code: ${result.data.resultCode}]: ${result.data.message}`);
        // throw new BadRequestException(`[Code: ${result.data.resultCode}]: ${momoResponseStatusCodeMapper[result.data.resultCode] ?? result.data.message}`);
      }
      const response: MomoCreateResponse = result.data;

      const payment = await this.paymentRepository.createPayment(new PaymentEntity(
        randomUUID(),
        data.orderId,
        paymentMethod.paymentMethodId,
        amount,
        EPaymentMethod.MOMO,
        EPaymentStatus.PENDING,
        new Date(),
        new Date(),
      ));

      if (!payment) {
        throw new BadRequestException('Payment creation failed!');
      }

      // Log payment transaction (create)
      await this.paymentRepository.createPaymentTransaction(
        new PaymentTransactionEntity(
          randomUUID(),
          payment.paymentId,
          JSON.stringify(requestBody),
          JSON.stringify(response),
          ETransactionType.INITIATED,
          new Date(),
          new Date(),
        ),
      );
      
      return {
        payUrl: response.payUrl,
      };
      
    } catch (error) {
      console.error('[Momo Pay Error]', error.response?.data || error.message);
      throw new BadRequestException(error.response?.data || error.message);
    }    
  }

  async capture(payment: PaymentEntity): Promise<PaymentEntity> {
    return payment;
  }

  async refund(payment: PaymentEntity): Promise<PaymentEntity> {
    return payment;
  }

  async cancel(payment: PaymentEntity): Promise<PaymentEntity> {
    return payment;
  }


  async handleIPN(body: GeneralIpn): Promise<{ response: any; payment: PaymentEntity | undefined; }> {  
    try {
      this.logger.log(`Processing Momo IPN for order: ${body.orderId}, resultCode: ${body.resultCode}`);

      // Validatation
      if (!body.orderId || !body.signature || body.resultCode === undefined) {
        throw new BadRequestException('Missing required IPN fields');
      }

      const payment = await this.paymentRepository.getPaymentByOrderId(this.extractMomoOrderId(body.orderId));

      if (!payment) {
        this.logger.warn(`Payment not found for Momo order: ${body.orderId}`);
        throw new BadRequestException('Payment not found!')
      }

      const accessKey =  process.env.MOMO_ACCESS_KEY;
      const secretKey = process.env.MOMO_SECRET_KEY;
      const partnerCode = process.env.MOMO_PARTNER_CODE;
      const momoUrl = process.env.NODE_ENV === 'production' ? process.env.MOMO_URL : process.env.MOMO_URL_TEST;

      if (!accessKey || !secretKey || !partnerCode || !momoUrl) {
        throw new BadRequestException('Momo payment: Missing configuration for MoMo payment gateway!');
      }

      const rawSignature =
        `accessKey=${accessKey}` +
        `&amount=${body.amount}` +
        `&extraData=${body.extraData}` +
        `&message=${body.message}` +
        `&orderId=${body.orderId}` +
        `&orderInfo=${body.orderInfo}` +
        `&orderType=${body.orderType}` +
        `&partnerCode=${body.partnerCode}` +
        `&payType=${body.payType}` +
        `&requestId=${body.requestId}` +
        `&responseTime=${body.responseTime}` +
        `&resultCode=${body.resultCode}` +
        `&transId=${body.transId}`;

      const signature = hashSHA256(rawSignature, secretKey);
      if (signature !== body.signature) {
        this.logger.error(`Invalid Momo signature for order: ${body.orderId}`);
        throw new BadRequestException('Invalid Momo signature!');
      }

      if ([EPaymentStatus.CAPTURED].includes(payment.status) ) {
        this.logger.warn(`Momo IPN: Order ${body.orderId} already processed with status ${payment.status}`);
        return {
          response: null,
          payment: payment
        }
      }

      // Log payment transaction (IPN)
      await this.paymentRepository.createPaymentTransaction(
        new PaymentTransactionEntity(
          randomUUID(),
          payment.paymentId,
          JSON.stringify({}),
          JSON.stringify(body),
          ETransactionType.WEBHOOK,
          new Date(),
          new Date(),
        ),
      );

      // Xử lý trường hợp đơn hàng không tồn tại hoặc đã bị hủy
      if (payment.status === EPaymentStatus.CANCELED) {
        this.logger.warn(`Payment not found for order: ${body.orderId}, attempting to cancel transaction`);
        try {
          const { requestPayload, responsePayload } = await this.momoConfirm(accessKey, secretKey, partnerCode, body.orderId, body.amount, EMomoConfirmType.CANCEL);
          await this.paymentRepository.createPaymentTransaction(
            new PaymentTransactionEntity(
              randomUUID(),
              payment.paymentId,
              JSON.stringify(requestPayload),
              JSON.stringify(responsePayload),
              ETransactionType.CANCELLED,
              new Date(),
              new Date(),
            ),
          );

          this.logger.log(`Successfully cancelled unknown transaction: ${body.orderId}`);
        } catch (cancelError) {
          this.logger.error(`Failed to cancel unknown transaction: ${body.orderId}`, cancelError.message);
        }
        throw new BadRequestException('Order not found!');
      }

      if (payment.status !== EPaymentStatus.PENDING) {
        this.logger.warn(`Momo IPN: Order ${body.orderId} already processed with status ${payment.status}`);
        return {
          response: null,
          payment: payment
        }
      }

      let newPaymentStatus: EPaymentStatus;

      // Xử lý kết quả thanh toán từ MoMo
      // Thanh toán 2 bước - cần xác nhận (capture)
      if (body.resultCode === 9000) {
        try {
          const { requestPayload, responsePayload } = await this.momoConfirm(accessKey, secretKey, partnerCode, body.orderId, body.amount, EMomoConfirmType.CAPTURE);

          await this.paymentRepository.createPaymentTransaction(
            new PaymentTransactionEntity(
              randomUUID(),
              payment.paymentId,
              JSON.stringify(requestPayload),
              JSON.stringify(responsePayload),
              ETransactionType.CAPTURED,
              new Date(),
              new Date(),
            ),
          );

          if (responsePayload.resultCode !== 0) {
            this.logger.error(`Momo confirm failed for order: ${body.orderId}, code: ${responsePayload.resultCode}`);
            throw new BadRequestException(`Momo confirm failed: ${responsePayload.message}`);
          }
          
          newPaymentStatus = EPaymentStatus.CAPTURED;
          this.logger.log(`Successfully confirmed Momo payment: ${body.orderId}`);
          
        } catch (confirmError) {
          this.logger.error(`Confirm error for order: ${body.orderId}`, confirmError.message);
          newPaymentStatus = EPaymentStatus.FAILED;
        }
        
      // Thanh toán 1 bước thành công - cập nhật trạng thái
      } else if (body.resultCode === 0) {
        newPaymentStatus = EPaymentStatus.CAPTURED;
        this.logger.log(`Momo payment successful: ${body.orderId}`);
        
      // Thanh toán thất bại - tiền không bị treo bên người dùng -> cập nhật trạng thái FAILED, không cần gọi cancel
      } else {
        newPaymentStatus = EPaymentStatus.FAILED;
        this.logger.log(`Momo payment failed: ${body.orderId}, reason: ${body.message}`);

      // Các mã code còn lại là giao dịch đang được xử lý - giữ trạng thái PENDING
      } 
      // else {
      //   newPaymentStatus = EPaymentStatus.PENDING;
      // }

      // Update payment status
      payment.status = newPaymentStatus;
      payment.updatedAt = new Date();

      await this.paymentRepository.updatePayment(payment);
      
      this.logger.log(`Payment status updated for order: ${body.orderId}, status: ${newPaymentStatus}`);

      return {
        response: "",
        payment: payment
      }
    } catch (error) {
      this.logger.error(`Momo IPN processing failed for order: ${body.orderId}`, error.stack);
      return {
        response: "",
        payment: undefined
      }
    }
  }

  private async momoConfirm(accessKey: string, secretKey: string, partnerCode: string, order_momo_id: string, amount: number, type: EMomoConfirmType ) {
    try {
      const momoUrl = process.env.NODE_ENV === 'production' ? process.env.MOMO_URL : process.env.MOMO_URL_TEST;
      if (!momoUrl) {
        throw new BadRequestException('Momo payment not configured!');
      }

      const requestId = randomUUID();
      // Tạo request body cho confirm
      const bodyConfirm: MomoConfirmRequest = {
        partnerCode,
        requestId,
        orderId: order_momo_id,
        requestType: type,
        lang: 'vi',
        amount,
        description: 'Payment confirmation',
        signature: '',
      };

      const rawSignatureConfirm =
        `accessKey=${accessKey}`+
        `&amount=${bodyConfirm.amount}` +
        `&description=${bodyConfirm.description}` +
        `&orderId=${bodyConfirm.orderId}` +
        `&partnerCode=${partnerCode}` +
        `&requestId=${requestId}` +
        `&requestType=${bodyConfirm.requestType}`;

      const signatureConfirm = hashSHA256(rawSignatureConfirm, secretKey);

      bodyConfirm.signature = signatureConfirm;

      const resultConfirm = await firstValueFrom(
        this.httpService.post(
          `${momoUrl}/confirm`,
          bodyConfirm,
        ),
      );

      const response: MomoConfirmResponse = resultConfirm.data;

      if (response.resultCode !== 0) {
        throw new BadRequestException(`[Code: ${response.resultCode}]: ${response.message}`);
      }

      return {
        requestPayload: bodyConfirm,
        responsePayload: response
      }

    } catch (error) {
      console.error('[Momo Confirm Error]', error.response?.data || error.message);
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  private generateMomoOrderId(id: string): string {
    return `${"A4S-"}${id}`;
  }

  private extractMomoOrderId(orderId: string): string {
    return orderId.replace("A4S-", "");
  }
}