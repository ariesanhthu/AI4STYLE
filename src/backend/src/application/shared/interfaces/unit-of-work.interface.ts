import { ICategoryRepository } from "@/core/category/interfaces";
import { IOrderRepository } from "@/core/order/interfaces";
import { IPaymentMethodRepository } from "@/core/payment-method/interfaces";
import { IPaymentRepository } from "@/core/payment/interfaces";
import { IProductRepository } from "@/core/product/interfaces";
import { IRoleRepository } from "@/core/role/interfaces";
import { IImageRepository } from "@/core/upload/interfaces";
import { IUserRepository } from "@/core/user/interfaces";

export interface IUnitOfWorkSession {
  categoryRepository: ICategoryRepository;
  orderRepository: IOrderRepository;
  paymentRepository: IPaymentRepository;
  paymentMethodRepository: IPaymentMethodRepository;
  productRepository: IProductRepository;
  roleRepository: IRoleRepository;
  imageRepository: IImageRepository;
  userRepository: IUserRepository;

  commit(): Promise<void>;
  rollback(): Promise<void>;
  end(): Promise<void>;
}

export interface IUnitOfWork {
  start(): Promise<IUnitOfWorkSession>;
}

export const UNIT_OF_WORK = Symbol('IUnitOfWork');