import { PrismaService } from '../prisma.service';
import { IUnitOfWork, IUnitOfWorkSession } from '@/application/shared';
export declare class PrismaUnitOfWork implements IUnitOfWork {
    private prisma;
    constructor(prisma: PrismaService);
    start(): Promise<IUnitOfWorkSession>;
}
