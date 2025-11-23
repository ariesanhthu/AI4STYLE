import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  GeneralIpn,
  MomoConfirmRequest,
  MomoConfirmResponse,
  MomoCreateResponse,
  MomoRefundRequest,
  MomoRefundResponse,
} from '../interfaces';
import {
  CreatePaymentDto,
  CreatePaymentResponseDto,
} from '@/application/payment/dtos';
import {
  PaymentEntity,
  PaymentAttemptEntity,
  PaymentTransactionEntity,
} from '@/core/payment/entities';
import { randomUUID } from 'crypto';
import { hashSHA256 } from '@/shared/helpers/hash.helper';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { firstValueFrom } from 'rxjs';
import {
  EMomoConfirmType,
  EPaymentStatus,
  ETransactionType,
} from '@/core/payment/enums';
import {
  IProviderGateway,
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '@/core/payment/interfaces';
import { EPaymentMethod } from '@/core/payment-method/enums';
import { PaymentMethodEntity } from '@/core/payment-method/entities';

@Injectable()
export class MomoService implements IProviderGateway {
  constructor(
    private readonly httpService: HttpService,
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) { }
  private readonly logger = new Logger(MomoService.name);
  type = EPaymentMethod.MOMO;

  async create(
    paymentId: string,
    orderNumber: number,
    paymentMethod: PaymentMethodEntity,
    amount: number,
  ): Promise<CreatePaymentResponseDto> {
    try {
      const { accessKey, secretKey, partnerCode, momoUrl } =
        this.loadMomoConfig();

      const redirectUrl = 'www.example.com/return'; // TODO: Thay đổi URL redirect sau khi thanh toán thành công
      const ipnUrl = process.env.MOMO_IPN_URL;
      const partnerName = process.env.MOMO_PARTNER_NAME || 'MoMo Payment';
      const storeId = process.env.MOMO_STORE_ID || '';
      const storeName = process.env.MOMO_STORE_NAME || '';

      if (!ipnUrl || !momoUrl) {
        throw new BadRequestException(
          'Momo payment: IPN URL or MoMo URL not configured!',
        );
      }

      const attemptId = randomUUID();
      const requestId = randomUUID();
      const orderInfo = 'pay with MoMo';
      const requestType = 'payWithMethod';
      const orderMomoId = this.generateMomoOrderId(attemptId);
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
        this.httpService.post(`${momoUrl}/create`, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      if (result.data.resultCode !== 0) {
        throw new BadRequestException(
          `[Code: ${result.data.resultCode}]: ${result.data.message}`,
        );
        // throw new BadRequestException(`[Code: ${result.data.resultCode}]: ${momoResponseStatusCodeMapper[result.data.resultCode] ?? result.data.message}`);
      }
      const response: MomoCreateResponse = result.data;

      // Create a new payment attempt
      const attempt = new PaymentAttemptEntity(
        attemptId,
        paymentId,
        paymentMethod.paymentMethodId,
        EPaymentMethod.MOMO,
        orderNumber,
        EPaymentStatus.PENDING,
        new Date(),
        new Date(),
      );

      const createdAttempt =
        await this.paymentRepository.createAttempt(attempt);

      if (!createdAttempt) {
        throw new BadRequestException('Payment attempt creation failed!');
      }

      // Log payment transaction (create)
      await this.paymentRepository.createTransaction(
        new PaymentTransactionEntity(
          randomUUID(),
          createdAttempt.paymentAttemptId,
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
    const lastAttempt = payment.getLatestAttempt();
    if (!lastAttempt) {
      throw new Error('No payment attempt found to cancel');
    }
    if (lastAttempt.type !== EPaymentMethod.MOMO) {
      throw new Error('Invalid payment method for cancellation');
    }

    const { accessKey, secretKey, partnerCode, momoUrl } =
      this.loadMomoConfig();

    const transId = payment.getValueInTransactionPayload(
      'transId',
      ETransactionType.CAPTURED,
    );
    if (!transId) {
      throw new Error('No transId found for captured payment');
    }

    if (Number.isNaN(Number(transId))) {
      throw new Error('Invalid transId found for captured payment');
    }
    const orderId = this.generateMomoOrderId(randomUUID());
    const requestId = randomUUID();
    const bodyRefund: MomoRefundRequest = {
      partnerCode,
      orderId,
      requestId,
      amount: payment.amount,
      transId: Number(transId),
      lang: 'vi',
      description: 'Payment refund',
      signature: '',
    };

    const rawSignatureConfirm =
      `accessKey=${accessKey}` +
      `&amount=${bodyRefund.amount}` +
      `&description=${bodyRefund.description}` +
      `&orderId=${orderId}` +
      `&partnerCode=${partnerCode}` +
      `&requestId=${requestId}` +
      `&transId=${bodyRefund.transId}`;

    const signatureConfirm = hashSHA256(rawSignatureConfirm, secretKey);

    bodyRefund.signature = signatureConfirm;

    const resultRefund = await firstValueFrom(
      this.httpService.post(`${momoUrl}/refund`, {
        ...bodyRefund,
        signature: signatureConfirm,
      }),
    );

    const response: MomoRefundResponse = resultRefund.data;

    await this.paymentRepository.createTransaction(
      new PaymentTransactionEntity(
        randomUUID(),
        lastAttempt.paymentAttemptId,
        JSON.stringify(bodyRefund),
        JSON.stringify(response),
        ETransactionType.REFUNDED,
        new Date(),
        new Date(),
      ),
    );

    if (response.resultCode !== 0) {
      throw new BadRequestException(
        `[Code: ${response.resultCode}]: ${response.message}`,
      );
    }
    lastAttempt.status = EPaymentStatus.REFUNDED;
    await this.paymentRepository.updateAttempt(lastAttempt);
    // Sync payment status from the attempt
    payment.syncStatusFromLatestAttempt();
    const updatedPayment = await this.paymentRepository.update(payment);

    return updatedPayment;
  }

  async cancel(payment: PaymentEntity): Promise<PaymentEntity> {
    const lastAttempt = payment.getLatestAttempt();
    if (!lastAttempt) {
      throw new Error('No payment attempt found to cancel');
    }
    if (lastAttempt.type !== EPaymentMethod.MOMO) {
      throw new Error('Invalid payment method for cancellation');
    }
    if (lastAttempt.status !== EPaymentStatus.PENDING) {
      throw new Error('Only pending payments can be canceled');
    }

    const { accessKey, secretKey, partnerCode, momoUrl } =
      this.loadMomoConfig();

    const { requestPayload, responsePayload } = await this.momoConfirm(
      accessKey,
      secretKey,
      partnerCode,
      this.generateMomoOrderId(lastAttempt.paymentAttemptId),
      payment.amount,
      EMomoConfirmType.CANCEL,
    );

    await this.paymentRepository.createTransaction(
      new PaymentTransactionEntity(
        randomUUID(),
        lastAttempt.paymentAttemptId,
        JSON.stringify(requestPayload),
        JSON.stringify(responsePayload),
        ETransactionType.CANCELLED,
        new Date(),
        new Date(),
      ),
    );

    lastAttempt.status = EPaymentStatus.CANCELED;
    await this.paymentRepository.updateAttempt(lastAttempt);

    // Sync payment status from the attempt
    payment.syncStatusFromLatestAttempt();
    const updatedPayment = await this.paymentRepository.update(payment);

    return updatedPayment;
  }

  async handleIPN(
    body: GeneralIpn,
  ): Promise<{ response: any; payment: PaymentEntity | undefined }> {
    try {
      this.logger.log(
        `Processing Momo IPN for order: ${body.orderId}, resultCode: ${body.resultCode}`,
      );

      // Validatation
      if (!body.orderId || !body.signature || body.resultCode === undefined) {
        throw new BadRequestException('Missing required IPN fields');
      }

      const payment = await this.paymentRepository.findByAttemptId(
        this.extractMomoOrderId(body.orderId),
      );

      if (!payment) {
        this.logger.warn(`Payment not found for Momo order: ${body.orderId}`);
        throw new BadRequestException('Payment not found!');
      }

      const { accessKey, secretKey, partnerCode, momoUrl } =
        this.loadMomoConfig();

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

      const attemptId = this.extractMomoOrderId(body.orderId);
      // Get the latest attempt
      const latestAttempt = payment.getAttemptById(attemptId);
      if (!latestAttempt) {
        this.logger.error(
          `No payment attempt found for payment: ${payment.paymentId}`,
        );
        throw new BadRequestException('No payment attempt found!');
      }

      // Check if payment is already in final state
      if ([EPaymentStatus.CAPTURED].includes(latestAttempt.status)) {
        this.logger.warn(
          `Momo IPN: Order ${body.orderId} already processed with status ${payment.status}`,
        );
        return {
          response: null,
          payment: payment,
        };
      }

      // Log payment transaction (IPN) - linked to the attempt
      await this.paymentRepository.createTransaction(
        new PaymentTransactionEntity(
          randomUUID(),
          latestAttempt.paymentAttemptId,
          JSON.stringify({}),
          JSON.stringify(body),
          ETransactionType.WEBHOOK,
          new Date(),
          new Date(),
        ),
      );

      // Xử lý trường hợp đơn hàng đã bị hủy
      if (latestAttempt.status === EPaymentStatus.CANCELED) {
        this.logger.warn(
          `Payment canceled for order: ${body.orderId}, attempting to cancel transaction`,
        );
        try {
          const { requestPayload, responsePayload } = await this.momoConfirm(
            accessKey,
            secretKey,
            partnerCode,
            body.orderId,
            body.amount,
            EMomoConfirmType.CANCEL,
          );
          await this.paymentRepository.createTransaction(
            new PaymentTransactionEntity(
              randomUUID(),
              latestAttempt.paymentAttemptId,
              JSON.stringify(requestPayload),
              JSON.stringify(responsePayload),
              ETransactionType.CANCELLED,
              new Date(),
              new Date(),
            ),
          );

          this.logger.log(
            `Successfully cancelled transaction: ${body.orderId}`,
          );
        } catch (cancelError) {
          this.logger.error(
            `Failed to cancel transaction: ${body.orderId}`,
            cancelError.message,
          );
        }
        throw new BadRequestException('Payment canceled!');
      }

      let newAttemptStatus: EPaymentStatus;

      // Xử lý kết quả thanh toán từ MoMo
      // Thanh toán 2 bước - cần xác nhận (capture)
      if (body.resultCode === 9000) {
        try {
          const { requestPayload, responsePayload } = await this.momoConfirm(
            accessKey,
            secretKey,
            partnerCode,
            body.orderId,
            body.amount,
            EMomoConfirmType.CAPTURE,
          );

          await this.paymentRepository.createTransaction(
            new PaymentTransactionEntity(
              randomUUID(),
              latestAttempt.paymentAttemptId,
              JSON.stringify(requestPayload),
              JSON.stringify(responsePayload),
              ETransactionType.CAPTURED,
              new Date(),
              new Date(),
            ),
          );

          if (responsePayload.resultCode !== 0) {
            this.logger.error(
              `Momo confirm failed for order: ${body.orderId}, code: ${responsePayload.resultCode}`,
            );
            throw new BadRequestException(
              `Momo confirm failed: ${responsePayload.message}`,
            );
          }

          newAttemptStatus = EPaymentStatus.CAPTURED;
          this.logger.log(
            `Successfully confirmed Momo payment: ${body.orderId}`,
          );
        } catch (confirmError) {
          this.logger.error(
            `Confirm error for order: ${body.orderId}`,
            confirmError.message,
          );
          newAttemptStatus = EPaymentStatus.FAILED;
        }

        // Thanh toán 1 bước thành công - cập nhật trạng thái
      } else if (body.resultCode === 0) {
        newAttemptStatus = EPaymentStatus.CAPTURED;
        this.logger.log(`Momo payment successful: ${body.orderId}`);

        // Thanh toán thất bại - tiền không bị treo bên người dùng -> cập nhật trạng thái FAILED, không cần gọi cancel
      } else {
        newAttemptStatus = EPaymentStatus.FAILED;
        this.logger.log(
          `Momo payment failed: ${body.orderId}, reason: ${body.message}`,
        );

        // Các mã code còn lại là giao dịch đang được xử lý - giữ trạng thái PENDING
      }
      // else {
      //   newAttemptStatus = EPaymentStatus.PENDING;
      // }

      // Update attempt status
      latestAttempt.status = newAttemptStatus;
      latestAttempt.updatedAt = new Date();
      await this.paymentRepository.updateAttempt(latestAttempt);

      this.logger.log(
        `Payment attempt status updated for order: ${body.orderId}, status: ${newAttemptStatus}`,
      );

      // Sync payment status from latest attempt
      payment.syncStatusFromLatestAttempt();
      await this.paymentRepository.update(payment);

      this.logger.log(
        `Payment status synced for order: ${body.orderId}, payment status: ${payment.status}`,
      );

      return {
        response: '',
        payment: payment,
      };
    } catch (error) {
      this.logger.error(
        `Momo IPN processing failed for order: ${body.orderId}`,
        error.stack,
      );
      return {
        response: '',
        payment: undefined,
      };
    }
  }

  private async momoConfirm(
    accessKey: string,
    secretKey: string,
    partnerCode: string,
    order_momo_id: string,
    amount: number,
    type: EMomoConfirmType,
  ) {
    try {
      const { momoUrl } = this.loadMomoConfig();
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
        `accessKey=${accessKey}` +
        `&amount=${bodyConfirm.amount}` +
        `&description=${bodyConfirm.description}` +
        `&orderId=${bodyConfirm.orderId}` +
        `&partnerCode=${partnerCode}` +
        `&requestId=${requestId}` +
        `&requestType=${bodyConfirm.requestType}`;

      const signatureConfirm = hashSHA256(rawSignatureConfirm, secretKey);

      bodyConfirm.signature = signatureConfirm;

      const resultConfirm = await firstValueFrom(
        this.httpService.post(`${momoUrl}/confirm`, bodyConfirm),
      );

      const response: MomoConfirmResponse = resultConfirm.data;

      if (response.resultCode !== 0) {
        throw new BadRequestException(
          `[Code: ${response.resultCode}]: ${response.message}`,
        );
      }

      return {
        requestPayload: bodyConfirm,
        responsePayload: response,
      };
    } catch (error) {
      console.error(
        '[Momo Confirm Error]',
        error.response?.data || error.message,
      );
      throw new BadRequestException(error.response?.data || error.message);
    }
  }

  private generateMomoOrderId(attemptId: string): string {
    return `${'A4S-'}${attemptId}`;
  }

  private extractMomoOrderId(orderId: string): string {
    return orderId.replace(/^A4S-/, '');
  }

  private loadMomoConfig() {
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const momoUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.MOMO_URL
        : process.env.MOMO_URL_TEST;

    if (!accessKey || !secretKey || !partnerCode || !momoUrl) {
      throw new BadRequestException(
        'Momo payment: Missing configuration for MoMo payment gateway!',
      );
    }

    return { accessKey, secretKey, partnerCode, momoUrl };
  }
}
