import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { type IProductRepository } from '@/core/product/interfaces';
export declare class BestSellerSchedulerService {
    private readonly prismaService;
    private readonly productRepository;
    private readonly logger;
    constructor(prismaService: PrismaService, productRepository: IProductRepository);
    handleBestSellerUpdate(): Promise<void>;
}
